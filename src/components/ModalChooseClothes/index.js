import React, {useContext} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {v4 as uuidv4} from 'uuid';
import {faPen, faUser, faVenusMars} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';
import FormTextInput from '../FormTextInput';
import FormInputSelect from '../FormInputSelect';

const ModalChooseClothes = () => {
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
    isCycling,
    settings,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const handleChangeClotingSettings = (
    newValue,
    clotheIndex,
    propertyToChange,
  ) => {
    const targetClothingSettings = editMode.enabled
      ? editMode.orderItem.clothingSettings
      : tempOrderItem.clothingSettings;

    // update clothing settins
    const updatedClothingSettings = targetClothingSettings
      .filter((item) => {
        // Always return no variant clothes, index 4 = Tanktop | index 5 = vest
        if (item.id > 4) return true;

        // Only return bike or normal clothes, never both;
        if (item.name.includes('Cycling') !== isCycling) return false;

        return true;
      })
      .map((item) => {
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
      addToast(Translator('TOAST_EMPTY_LIST'), {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    // CALCULATE PAYMENT VALUE BASED IN PRICES DATA
    const paymentPriceForNewOrderItem = Utils.CalculatePaymentValueToOrderItem(
      currentClothingPrices,
      clothingSizes,
      tempOrderItem.clothingSettings,
      tempOrderItem.gender,
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

    addToast(Translator('TOAST_ITEM_ADDED'), {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const headerPhrase = () => {
    const phrase =
      tempOrderItem.name === '' ? (
        <span>{Translator('HEADER_PHRASE_NO_NAME')}</span>
      ) : (
        <span>
          {Translator('HEADER_PHRASE_WITH_NAME')}
          <strong>{tempOrderItem.name}</strong>.
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
      clothingSizes,
      noEmptyClothes,
      tempOrderItem.gender,
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
      addToast(Translator('TOAST_EMPTY_LIST_ON_UPDATE'), {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    // console.log('UPDATING ORDER ITEM...');

    // UPDATE LIST
    const updatedOrderListItems = orderListItems.map((orderItem) => {
      if (orderItem.id === updatedOrderItem.id) {
        // ITEM FOUND, RECALCULATE PAYMENT VALUE
        const paymentValue = Utils.CalculatePaymentValueToOrderItem(
          currentClothingPrices,
          clothingSizes,
          updatedOrderItem.clothingSettings,
          updatedOrderItem.gender,
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
    const confirmDialog = window.confirm(Translator('CONFIRM_DELETE_ITEM'));

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

  const getTargetOrderItemToManipulate = () =>
    editMode.enabled ? editMode.orderItem : tempOrderItem;

  return (
    <Modal show={modalClothesOpened} onHide={handleOnHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {!editMode.enabled
            ? Translator('CHOOSE_CLOTHES_ADD')
            : Translator('CHOOSE_CLOTHES_EDIT')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={editMode.enabled ? 'd-none' : 'd-block'}>
          {headerPhrase()}
        </div>
        <div className="d-block">
          {Translator('CHOOSE_CLOTHES_VALUE')}
          <strong>
            {settings.coinPrefix} {calculatePriceForCurrentSelectedClothes()}
          </strong>
          .
        </div>

        <div className="mt-4" style={{margin: '0 auto', maxWidth: '350px'}}>
          {editMode.enabled && (
            <>
              <Row>
                <Col>
                  <FormTextInput
                    icon={faUser}
                    label={`${Translator('NAME')}:`}
                    placeholder={`${Translator('NAME_PLACEHOLDER')}:`}
                    value={editMode.orderItem.name}
                    onChange={handleChangeEditName}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormTextInput
                    icon={faPen}
                    label={`${Translator('NUMBER')}:`}
                    placeholder={`${Translator('EXAMPLE_ABBREV')}256`}
                    value={editMode.orderItem.number}
                    onChange={handleChangeEditNumber}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormInputSelect
                    label={`${Translator('GENDER')}:`}
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
            <Col xs={5}>{Translator('SIZE')}</Col>
            <Col xs={5}>{Translator('QUANTITY')}</Col>
          </Row>

          {Object.keys(clothingIcons)
            // FILTER BY ICONS
            .filter((key) => {
              // Always return no variant clothes
              if (clothingIcons[key].isCycling === undefined) return true;

              // Only return bike or normal clothes, never both;
              if (clothingIcons[key].isCycling !== isCycling) return false;

              return true;
            })
            // FILTER BY EMPTY PRICES
            .filter((key) => {
              if (currentClothingPrices === null) return false;

              const theGender = tempOrderItem.gender;
              const targetPriceTable = Utils.GetPriceTableByGender(
                currentClothingPrices,
                theGender,
              );

              let totalValueOfCurrentClothe = 0;
              targetPriceTable[key.replace('Cycling', '')].map((price) => {
                totalValueOfCurrentClothe += price;
                return price;
              });

              return totalValueOfCurrentClothe > 0;
            })
            .map((key) => (
              <Row className="align-items-center" key={key}>
                {/* ICON */}
                <Col xs={2}>
                  <img src={clothingIcons[key].icon} alt="clothe icon" />
                </Col>

                {/* SIZE */}
                <Col xs={5}>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
                    custom
                    value={csGetSizeByID(
                      clothingIcons[key].id,
                      getTargetOrderItemToManipulate(),
                    )}
                    onChange={(e) => {
                      handleChangeClotingSettings(
                        e.target.value,
                        clothingIcons[key].id,
                        'size',
                      );
                    }}>
                    <option value="">{Translator('NONE')}</option>

                    {clothingSizes
                      .filter((size, index) => {
                        if (currentClothingPrices === null) return false;

                        const theGender = tempOrderItem.gender;
                        const targetPriceTable = Utils.GetPriceTableByGender(
                          currentClothingPrices,
                          theGender,
                        );

                        return (
                          targetPriceTable[key.replace('Cycling', '')][index] >
                            0 || false
                        );
                      })
                      .map((size) => {
                        if (
                          getTargetOrderItemToManipulate().gender === 'CHILDISH'
                        ) {
                          // RENDER ONLY CHILDISH SIZES
                          console.log('render only childish sizes');
                          if (size.target === 'ADULT') return false;
                        }

                        if (
                          getTargetOrderItemToManipulate().gender === 'MALE' ||
                          getTargetOrderItemToManipulate().gender === 'FEMALE'
                        ) {
                          // RENDER ONLY ADULT SIZES
                          if (size.target === 'TEEN') return false;
                        }

                        return (
                          <option
                            key={size.id}
                            value={size.code}
                            data-id={size.id}>
                            {Translator(size.code)}
                          </option>
                        );
                      })}
                  </Form.Control>
                </Col>

                {/* QUANTITY */}
                <Col xs={5}>
                  <Form.Control
                    as="select"
                    className="my-1 mr-sm-2"
                    custom
                    value={csGetQuantityByID(
                      clothingIcons[key].id,
                      getTargetOrderItemToManipulate(),
                    )}
                    onChange={(e) => {
                      handleChangeClotingSettings(
                        parseInt(e.target.value),
                        clothingIcons[key].id,
                        'quantity',
                      );
                    }}>
                    <option value={0}>0 {Translator('PIECES')}</option>
                    {[...Array(settings.maxQuantityPerClothe).keys()].map(
                      (quantity) => {
                        const trueQuantity = quantity + 1;
                        return (
                          <option key={trueQuantity} value={trueQuantity}>
                            {trueQuantity}{' '}
                            {trueQuantity === 1
                              ? Translator('PIECE')
                              : Translator('PIECES')}
                          </option>
                        );
                      },
                    )}
                  </Form.Control>
                </Col>
              </Row>
            ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleOnHide}>
          {Translator('CLOSE')}
        </Button>
        {editMode.enabled && (
          <Button
            variant="danger"
            onClick={() => handleDelete(editMode.orderItem.id)}>
            {Translator('DELETE')}
          </Button>
        )}
        <Button
          variant="primary"
          onClick={
            !editMode.enabled ? handleAddNewOrderItem : handleEditOrderItem
          }>
          {Translator('SAVE_CHANGES')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalChooseClothes;
