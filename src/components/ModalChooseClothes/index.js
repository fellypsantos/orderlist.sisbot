import React, {useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {v4 as uuidv4} from 'uuid';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

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
    dashboardData,
    setDashboardData,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

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
    const noEmptyClothes = tempOrderItem.clothingSettings.filter(
      (clotheItem) => clotheItem.size !== '' && clotheItem.quantity !== 0,
    );

    const currentValue = Utils.CalculatePaymentValueToOrderItem(
      currentClothingPrices,
      noEmptyClothes,
    );

    return currentValue;
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
          Valor dos itens:{' '}
          <strong>$ {calculatePriceForCurrentSelectedClothes()}</strong>.
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
