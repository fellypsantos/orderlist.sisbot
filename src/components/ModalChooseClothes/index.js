import React, {useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Accordion from 'react-bootstrap/Accordion';

import {v4 as uuidv4} from 'uuid';
import {faPen, faUser, faVenusMars} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';
import FormTextInput from '../FormTextInput';
import FormInputSelect from '../FormInputSelect';

const maxQuantityPerPiece = [...Array(50).keys()];

export default function ModalChooseClothes() {
  const {
    clothingIcons,
    clothingSizes,
    modalClothesOpened,
    setModalClothesOpened,
    Translator,
    initialStateTempOrderItem,
    tempOrderItem,
    setTempOrderItem,
    orderListItems,
    setOrderListItems,
    currentClothingPrices,
    editMode,
    setEditMode,
    genderOptions,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const handleChangeClotingSettings = (
    newValue,
    clotheIndex,
    propertyToChange,
  ) => {
    // DEFINE WITH CLOTHE SETTINGS TO USE
    // tempOrderItem -> FOR NEW ORDER ITEM
    // editMode.orderItem -> FOR UPDATES
    const targetClothingSettings = editMode.enabled
      ? editMode.orderItem.clothingSettings
      : tempOrderItem.clothingSettings;

    // update clothing settins
    const updatedClothingSettings = targetClothingSettings.map((item) => {
      if (item.id === clotheIndex) {
        // found the clothe to update
        return {
          ...item,
          size: propertyToChange === 'size' ? newValue : item.size,
          quantity: propertyToChange === 'quantity' ? newValue : item.quantity,
        };
      }

      return item;
    });

    // update global state

    // NEW ORDER ITEM
    if (!editMode.enabled) {
      setTempOrderItem({
        ...tempOrderItem,
        clothingSettings: updatedClothingSettings,
      });
    } else {
      setEditMode({
        enabled: true,
        orderItem: {
          ...editMode.orderItem,
          clothingSettings: updatedClothingSettings,
        },
      });
    }
  };

  const handleAddNewOrderItem = () => {
    const emptyItems = tempOrderItem.clothingSettings.filter(
      (item) => item.size === '' || item.quantity === 0,
    );

    if (emptyItems.length === tempOrderItem.clothingSettings.length) {
      // ALL ITEMS ARE EMPTY
      addToast('Lista vazia! Não há nada para adicionar até o momento.', {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    // CALCULATE PAYMENT VALUE BASED IN PRICES DATA
    const paymentPriceForNewOrderItem = Utils.CalculatePaymentValueToOrderItem(
      currentClothingPrices,
      tempOrderItem.clothingSettings,
    );

    // UPDATE MAIN LIST
    setOrderListItems([
      ...orderListItems,
      {
        ...tempOrderItem,
        id: uuidv4(),
        payment: {
          paid: false,
          value: paymentPriceForNewOrderItem,
        },
      },
    ]);

    // CLEAR TEMP DATA
    setTempOrderItem(initialStateTempOrderItem);

    setModalClothesOpened(false);

    addToast('Feito! Novo item adicionado na sua lista de pedidos.', {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const headerPhrase = () => {
    const phrase =
      tempOrderItem.name === '' ? (
        <span>Selecione o que precisa para essa nova ordem.</span>
      ) : (
        <span>
          Selecione o que precisa para <strong>{tempOrderItem.name}</strong>.
        </span>
      );

    return phrase;
  };

  const calculatePriceForCurrentSelectedClothes = () => {
    // PROCESS ONLY NO EMPTY CLOTHES
    // NO EMPTY HAS SIZE AND QUANTITY FILLED
    const targetOrderItem = editMode.enabled
      ? editMode.orderItem
      : tempOrderItem;

    const noEmptyClothes = targetOrderItem.clothingSettings.filter(
      (clotheItem) => clotheItem.size !== '' && clotheItem.quantity !== 0,
    );

    const currentValue = Utils.CalculatePaymentValueToOrderItem(
      currentClothingPrices,
      noEmptyClothes,
    );

    return currentValue;
  };

  const handleOnHide = () => {
    setModalClothesOpened(false);

    if (editMode) {
      setEditMode({
        enabled: false,
        orderItem: null,
      });
    }
  };

  const handleChangeEditName = (e) => {
    setEditMode({
      enabled: true,
      orderItem: {
        ...editMode.orderItem,
        name: e.target.value,
      },
    });
  };

  const handleChangeEditNumber = (e) => {
    setEditMode({
      enabled: true,
      orderItem: {
        ...editMode.orderItem,
        number: e.target.value.trim(),
      },
    });
  };

  const handleChangeEditGender = (e) => {
    setEditMode({
      enabled: true,
      orderItem: {
        ...editMode.orderItem,
        gender: e.target.value.trim(),
      },
    });
  };

  const handleEditOrderItem = () => {
    const updatedOrderItem = editMode.orderItem;

    const emptyItems = updatedOrderItem.clothingSettings.filter(
      (item) => item.size === '' || item.quantity === 0,
    );

    if (emptyItems.length === updatedOrderItem.clothingSettings.length) {
      // ALL ITEMS ARE EMPTY
      addToast(
        'Lista vazia! Você não pode editar a informação deixando vazia.',
        {
          appearance: 'error',
          autoDismiss: true,
        },
      );

      return;
    }

    console.log('UPDATING ORDER ITEM...');

    // UPDATE LIST
    const updatedOrderListItems = orderListItems.map((orderItem) => {
      if (orderItem.id === updatedOrderItem.id) {
        // ITEM FOUND, RECALCULATE PAYMENT VALUE
        const paymentValue = Utils.CalculatePaymentValueToOrderItem(
          currentClothingPrices,
          updatedOrderItem.clothingSettings,
        );

        // RETURN UPDATED DATA
        return {
          ...updatedOrderItem,
          payment: {
            ...updatedOrderItem.payment,
            value: paymentValue,
          },
        };
      }

      // RETURN ITEM WITHOUT CHANGES
      return orderItem;
    });

    setModalClothesOpened(false);
    setOrderListItems(updatedOrderListItems);

    setEditMode({
      enabled: false,
      orderItem: null,
    });
  };

  const handleDelete = (itemID) => {
    const confirmDialog = window.confirm(
      'Quer mesmo excluir esse item da lista de pedidos?',
    );

    if (confirmDialog) {
      // USER CONFIRMED! DELETE
      const updatedOrderListItems = orderListItems.filter(
        (orderItem) => orderItem.id !== itemID,
      );

      setEditMode({
        enabled: false,
        orderItem: null,
      });
      setModalClothesOpened(false);
      setOrderListItems(updatedOrderListItems);
    }
  };

  const csGetSizeByID = (theID, orderItem) =>
    orderItem.clothingSettings[theID - 1].size;

  const csGetQuantityByID = (theID, orderItem) =>
    orderItem.clothingSettings[theID - 1].quantity;

  return (
    <Modal show={modalClothesOpened} onHide={handleOnHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {!editMode.enabled ? 'Escolha as Roupas' : 'Modo de Edição'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={editMode.enabled ? 'd-none' : 'd-block'}>
          {headerPhrase()}
        </div>
        <div className="d-block">
          Valor dos itens:{' '}
          <strong>$ {calculatePriceForCurrentSelectedClothes()}</strong>.
        </div>

        <div className="mt-4" style={{margin: '0 auto', maxWidth: '350px'}}>
          {editMode.enabled && (
            <>
              <Row>
                <Col>
                  <FormTextInput
                    icon={faUser}
                    label="Nome:"
                    placeholder="Ex: Jhon Doe"
                    value={editMode.orderItem.name}
                    onChange={handleChangeEditName}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormTextInput
                    icon={faPen}
                    label="Número:"
                    placeholder="Ex: 256"
                    value={editMode.orderItem.number}
                    onChange={handleChangeEditNumber}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormInputSelect
                    label="Gênero"
                    icon={faVenusMars}
                    value={editMode.orderItem.gender}
                    arrOptions={genderOptions}
                    onChange={handleChangeEditGender}
                  />
                </Col>
              </Row>
            </>
          )}

          <Row>
            <Col xs={2}>&nbsp;</Col>
            <Col xs={5}>Tamanho</Col>
            <Col xs={5}>Quantidade</Col>
          </Row>

          {/* Clothing Row */}
          {clothingIcons.map((iconItem) => (
            <Row key={iconItem.id} className="align-items-center">
              {/* ICON */}
              <Col xs={2}>
                <img src={iconItem.icon} alt="clothe icon" />
              </Col>

              {/* tempOrderItem.clothingSettings[iconItem.id - 1].size */}

              {/* SIZE */}
              <Col xs={5}>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  custom
                  value={
                    editMode.enabled
                      ? csGetSizeByID(iconItem.id, editMode.orderItem)
                      : csGetSizeByID(iconItem.id, tempOrderItem)
                  }
                  onChange={(e) => {
                    handleChangeClotingSettings(
                      e.target.value,
                      iconItem.id,
                      'size',
                    );
                  }}>
                  <option value="">Nenhum</option>
                  {clothingSizes.map((size) => (
                    <option key={size.id} value={size.code} data-id={size.id}>
                      {Translator(size.code)}
                    </option>
                  ))}
                </Form.Control>
              </Col>

              {/* QUANTITY */}
              <Col xs={5}>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  custom
                  value={
                    !editMode.enabled
                      ? csGetQuantityByID(iconItem.id, tempOrderItem)
                      : csGetQuantityByID(iconItem.id, editMode.orderItem)
                  }
                  onChange={(e) => {
                    handleChangeClotingSettings(
                      parseInt(e.target.value),
                      iconItem.id,
                      'quantity',
                    );
                  }}>
                  <option value={0}>0 Peças</option>
                  {maxQuantityPerPiece.map((quantity) => {
                    const trueQuantity = quantity + 1;
                    return (
                      <option key={trueQuantity} value={trueQuantity}>
                        {trueQuantity} {trueQuantity === 1 ? 'Peça' : 'Peças'}
                      </option>
                    );
                  })}
                </Form.Control>
              </Col>
            </Row>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          Fechar
        </Button>
        {editMode.enabled && (
          <Button
            variant="danger"
            onClick={() => handleDelete(editMode.orderItem.id)}>
            Excluir
          </Button>
        )}
        <Button
          variant="primary"
          onClick={
            !editMode.enabled ? handleAddNewOrderItem : handleEditOrderItem
          }>
          Salvar alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
