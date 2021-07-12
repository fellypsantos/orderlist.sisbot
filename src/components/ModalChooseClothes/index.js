import React, {useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {OrderListContext} from '../../contexts/OrderListContext';

const maxQuantityPerPiece = [...Array(50).keys()];

export default function ModalChooseClothes() {
  const {
    clothingIcons,
    clothingSizes,
    modalClothesOpened,
    setModalClothesOpened,
    Translator,
    tempOrderItem,
    setTempOrderItem,
  } = useContext(OrderListContext);

  const handleChangeClotingSettings = (
    newValue,
    clotheIndex,
    propertyToChange,
  ) => {
    // update clothing settins
    const updatedClothingSettings = tempOrderItem.clothingSettings.map(
      (item) => {
        if (item.id === clotheIndex) {
          // found the clothe to update
          return {
            ...item,
            size: propertyToChange === 'size' ? newValue : item.size,
            quantity:
              propertyToChange === 'quantity' ? newValue : item.quantity,
          };
        }

        return item;
      },
    );

    // update global state
    setTempOrderItem({
      ...tempOrderItem,
      clothingSettings: updatedClothingSettings,
    });
  };

  const handleAddNewOrderItem = () => {
    // check if is empty settins in modal
    // if not! save the item
    setTempOrderItem({
      ...tempOrderItem,
      name: 'Analfa Beto',
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

  return (
    <Modal
      show={modalClothesOpened}
      onHide={() => setModalClothesOpened(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Escolha as Roupas</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-block">{headerPhrase()}</div>
        <div className="d-block">
          Valor dos itens: <strong>$ 0</strong>.
        </div>

        <div className="mt-4" style={{margin: '0 auto', maxWidth: '300px'}}>
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

              {/* SIZE */}
              <Col xs={5}>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  custom
                  value={tempOrderItem.clothingSettings[iconItem.id - 1].size}
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
                    tempOrderItem.clothingSettings[iconItem.id - 1].quantity
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
        <Button
          variant="secondary"
          onClick={() => setModalClothesOpened(false)}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleAddNewOrderItem}>
          Salvar alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
