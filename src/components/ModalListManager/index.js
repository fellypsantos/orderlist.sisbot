import React, {useContext, useState} from 'react';
import {v4 as uuidv4} from 'uuid';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from 'react-bootstrap/Table';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus, faTrash} from '@fortawesome/free-solid-svg-icons';

import {OrderListContext} from '../../contexts/OrderListContext';
import Clickable from '../Clickable';

const ModalListManager = ({isOpen, handleClose}) => {
  const [newListName, setNewListName] = useState('');
  const [timeoutHandler, setTimeoutHandler] = useState(null);
  const [listIdToDelete, setListIdToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    Translator,
    setListName,
    setOrderListItems,
    setActiveListID,
    sublists,
    setSublists,
    setOrderListClientNotes,
    setOrderListItemsNotes,
    setIsCycling,
  } = useContext(OrderListContext);

  const handleCreateNewList = (event) => {
    event.preventDefault();
    if (newListName === '') return false;

    console.warn('- - - - - - - - - - FORM_SUBMITED - - - - - - - - - - ');

    // RECEITA PRA CRIAR UMA NOVA SUBLISTA
    // 1 - PEGA A LISTA ATUAL E SALVA COMO SUBLIST
    const currentListLocalStorage = localStorage.getItem('sisbot');
    const currentListData = JSON.parse(currentListLocalStorage);
    setSublists([...sublists, currentListData]);
    console.log('Salvei a lista que tu tava editando.');

    // 2 - AGORA LIMPA A LISTA ATUAL SETANDO UM NOVO ID
    console.warn('Agora vou prepara a nova.');
    setListName(newListName);
    console.log('✅ Nome da lista.');
    setOrderListItems([]);
    console.log('✅ Lista vazia.');
    setOrderListClientNotes('');
    console.log('✅ Notas do cliente vazias.');
    setOrderListItemsNotes('');
    console.log('✅ Notas do pedido vazias.');
    setActiveListID(uuidv4());
    console.log('✅ Novo UUID gerado para a nova lista.');

    // 3 - FINALIZA O PROCESSO LIMPANDO O FORM E FECHANDO A MODAL
    setNewListName('');
    handleClose();
  };

  const askConfirmDelete = (listID) => {
    // PREPARE TIMER
    const timeout = setTimeout(() => {
      setListIdToDelete(null);
      setShowConfirmDelete(false);
    }, 2000);

    setListIdToDelete(listID);
    setShowConfirmDelete(true);
    setTimeoutHandler(timeout);
  };

  const handleSwitchList = (listID) => {
    console.warn('- - - - - - - - - - SWITCH LIST - - - - - - - - - - ');

    // PEGA DA SUBLISTA -> A LISTA QUE O CARA QUER (SPLICE PRA PEGAR O ITEM E REMOVER DO ARRAY)
    const selectedList = sublists.find((listItem) => listItem.id === listID);

    const updatedSublists = sublists.filter(
      (listItem) => listItem.id !== listID,
    );

    // AGORA PEGA A LISTA ATUAL QUE O CABOCO TÁ EDITANDO
    // E SALVA COMO UMA SUBLIST
    console.log('Saving current editing list...');
    const currentListLocalStorage = localStorage.getItem('sisbot');
    const currentListData = JSON.parse(currentListLocalStorage);
    setSublists([...updatedSublists, currentListData]);
    console.log('Salvei a lista que tu tava editando.');

    // AGORA LIMPA A LISTA ATUAL E CARREGA A SELECIONADA
    console.warn('Agora vou carregar a lista selecionada.');
    setListName(selectedList.listName);
    console.log('✅ Nome da lista.');
    setOrderListItems(selectedList.orderListItems);
    console.log('✅ Lista vazia.');
    setOrderListClientNotes(selectedList.orderListClientNotes);
    console.log('✅ Notas do cliente vazias.');
    setOrderListItemsNotes(selectedList.orderListItemsNotes);
    console.log('✅ Notas do pedido vazias.');
    setIsCycling(selectedList.isCycling);
    console.log('✅ Flag de ciclismo carregada.');
    setActiveListID(selectedList.id);
    console.log('✅ UUID carregado na lista.');

    handleClose();
  };

  const handleDelete = (listID) => {
    // CLEAR THE RUNNING TIMEOUT
    clearTimeout(timeoutHandler);
    setTimeoutHandler(null);

    const updatedSublist = sublists.filter(
      (listItem) => listItem.id !== listID,
    );
    setSublists(updatedSublist);
  };

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translator('LIST_MANAGER_TITLE')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* RENDER FORM */}
        <form onSubmit={handleCreateNewList}>
          <Row>
            <Col className="col-8 pr-0">
              <Form.Control
                as="input"
                value={newListName}
                onChange={({target}) => setNewListName(target.value)}
                placeholder={Translator('ASK_NEW_LIST_NAME')}
              />
            </Col>
            <Col className="pl-2">
              <ButtonGroup className="d-flex">
                <Button onClick={handleCreateNewList}>
                  <FontAwesomeIcon icon={faPlus} />
                  <span className="d-none d-sm-inline">
                    {' '}
                    {Translator('ADD')}
                  </span>
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </form>

        {/* RENDER LISTS */}
        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th width="350">{Translator('LIST')}</th>
              <th className="text-center">{Translator('DELETE')}</th>
            </tr>
          </thead>
          <tbody>
            {sublists.map((listItem) => (
              <tr key={listItem.id}>
                <td>
                  <Clickable handleClick={() => handleSwitchList(listItem.id)}>
                    {listItem.listName || Translator('MAIN_TITLE')}
                  </Clickable>
                </td>
                <td className="text-center">
                  {showConfirmDelete && listIdToDelete === listItem.id ? (
                    <Clickable
                      handleClick={() => handleDelete(listItem.id)}
                      className="color-flat-red">
                      {Translator('CONFIRM')}
                    </Clickable>
                  ) : (
                    <Clickable
                      handleClick={() => askConfirmDelete(listItem.id)}
                      className="color-flat-red">
                      <FontAwesomeIcon icon={faTrash} />
                    </Clickable>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            {sublists.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center">
                  {Translator('NO_SUBLISTS_YET')}
                </td>
              </tr>
            )}
          </tfoot>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalListManager;
