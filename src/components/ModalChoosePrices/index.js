import React, {useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

const ModalChoosePrices = () => {
  const {
    currentClothingPrices,
    setCurrentClothingPrices,
    modalPricesOpened,
    setModalPricesOpened,
    orderListItems,
    setOrderListItems,
    Translator,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const handleChange = (e, clotheID) => {
    const theValue = e.target.value.trim();

    const updatedPrices = currentClothingPrices.map((clothe) => {
      if (clothe.id === clotheID) {
        return {
          ...clothe,
          price: theValue,
        };
      }
      return clothe;
    });

    // UPDATE GLOBAL STATE
    setCurrentClothingPrices(updatedPrices);
  };

  const handleSaveChanges = () => {
    console.log('PERSISTIR EM LOGALSTORAGE');

    // RECALCULATE THE TOTAL PRICE OF EACH ORDER ITEM
    const recalculatedOrderItems = orderListItems.map((orderItem) => {
      // PROCESS THE PRICES ONLY
      const paymentValueForCurrentItem = Utils.CalculatePaymentValueToOrderItem(
        currentClothingPrices,
        orderItem.clothingSettings,
      );

      // UPDATED ORDER ITEM
      const recalculatedOrderItem = {
        ...orderItem,
        payment: {
          ...orderItem.payment,
          value: paymentValueForCurrentItem,
        },
      };

      return recalculatedOrderItem;
    });

    // UPDATE GLOBAL STYLE WITH RECALCULATED ORDER ITEMS
    setOrderListItems(recalculatedOrderItems);

    // CLOSE MODAL
    setModalPricesOpened(false);

    addToast(Translator('TOAST_PRICES_LIST_SAVED'), {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  return (
    <Modal show={modalPricesOpened} onHide={() => setModalPricesOpened(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{Translator('CLOTHING_PRICES')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-block">{Translator('SETUP_UNIT_PRICE')}</div>

        <div className="mt-4" style={{margin: '0 auto', maxWidth: '200px'}}>
          {/* Clothing Row */}
          {currentClothingPrices.map((clotheItem) => (
            <Row key={clotheItem.id} className="align-items-center">
              {/* ICON */}
              <Col xs={2} className="d-flex justify-content-center">
                <img src={clotheItem.icon} alt="clothe icon" />
              </Col>

              {/* PRICE */}
              <Col xs={10} className="d-flex align-items-center">
                <strong className="mr-3">$</strong>
                <Form.Group className="mt-1 mb-1">
                  <Form.Control
                    type="number"
                    pattern="[-+]?[0-9]*[.,]?[0-9]+"
                    placeholder="0"
                    value={clotheItem.price}
                    onChange={(e) => handleChange(e, clotheItem.id)}
                    onBlur={(e) => handleChange(e, clotheItem.id)}
                  />
                </Form.Group>
              </Col>
            </Row>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setModalPricesOpened(false)}>
          {Translator('CLOSE')}
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          {Translator('SAVE_CHANGES')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChoosePrices;
