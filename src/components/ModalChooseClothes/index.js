import React, {useContext, useState, useEffect} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Select from 'react-select';

import {v4 as uuidv4} from 'uuid';
import {faPen, faUser} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';
import FormTextInput from '../FormTextInput';

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
    isCycling,
    settings,
    shouldFiter,
  } = useContext(OrderListContext);

  const [clothingSizesDropDown, setClothingSizesDropDown] = useState([]);

  useEffect(() => {
    const maleSizes = [];
    const femaleSizes = [];
    const childSizes = [];

    // GENERATE DATA SEPARATED BY GROUPS IN DROPDOWN
    clothingSizes.forEach((item) => {
      const addItem = {...item, label: Translator(item.value)};

      if (item.gender === 'MALE') maleSizes.push(addItem);
      if (item.gender === 'FEMALE') femaleSizes.push(addItem);
      if (item.gender === 'CHILDISH') childSizes.push(addItem);

      const groupedDropDown = [
        {
          label: Translator('MALE'),
          options: maleSizes,
        },
        {
          label: Translator('FEMALE'),
          options: femaleSizes,
        },
        {
          label: Translator('CHILDISH'),
          options: childSizes,
        },
      ];

      setClothingSizesDropDown(groupedDropDown);
    });
  }, [Translator]);

  const {addToast} = useToasts();

  const getTargetOrderItemToManipulate = () =>
    editMode.enabled ? editMode.orderItem : tempOrderItem;

  const handleChangeClotingSettings = (
    newSize,
    newGender,
    newQuantity,
    clotheIndex,
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
            size: newSize !== undefined ? newSize : item.size,
            gender: newGender !== undefined ? newGender : item.gender,
            quantity: newQuantity !== undefined ? newQuantity : item.quantity,
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

  const handleClearClothingSettings = (clotheIndex) => {
    const targetOrderItem = getTargetOrderItemToManipulate();
    const updatedClothingSettings = targetOrderItem.clothingSettings.map(
      (item) => {
        if (item.id - 1 === clotheIndex) {
          console.log('FOUND!', item);
          return {
            ...item,
            gender: '',
            size: '',
            quantity: 0,
          };
        }

        return item;
      },
    );

    console.log('updatedClothingSettings', updatedClothingSettings);

    // UPDATE CORRECT STATE
    if (!editMode.enabled) {
      setTempOrderItem({
        ...targetOrderItem,
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

    if (noEmptyClothes.length === 0) return '0.00';

    const currentValue = Utils.CalculatePaymentValueToOrderItem(
      currentClothingPrices,
      clothingSizes,
      noEmptyClothes,
      tempOrderItem.gender,
    );

    return currentValue.toFixed(2);
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

  const csGetSizeByID = (theID, colorOnly = false) => {
    const targetOrderItem = getTargetOrderItemToManipulate();
    const theSize = targetOrderItem.clothingSettings[theID - 1].size;
    const theGender = targetOrderItem.clothingSettings[theID - 1].gender;
    const theGenderIndex = Utils.ParseGenderToIndex(theGender);

    if (theSize === '' || theGender === '') return false;

    // Filter to get previews selected value in <Select> elemment
    const theValue = clothingSizesDropDown[theGenderIndex].options.filter(
      (option) => option.value === theSize,
    );

    const theColor = theValue.length > 0 ? theValue[0].color : '#fff';
    return colorOnly ? theColor : theValue;
  };

  const csGetQuantityByID = (theID, orderItem) =>
    orderItem.clothingSettings[theID - 1].quantity;

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

              if (!shouldFiter) return true;

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
                {/* DRAW THE ICONS */}
                <Col xs={2}>
                  <img src={clothingIcons[key].icon} alt="clothe icon" />
                </Col>

                {/* SIZE */}
                <Col xs={5}>
                  <Select
                    isClearable
                    options={clothingSizesDropDown}
                    value={csGetSizeByID(clothingIcons[key].id)}
                    onChange={(selectedItem) => {
                      if (selectedItem !== null) {
                        const previewsQuantity = csGetQuantityByID(
                          clothingIcons[key].id,
                          getTargetOrderItemToManipulate(),
                        );

                        handleChangeClotingSettings(
                          selectedItem.value || null,
                          selectedItem.gender,
                          // AUTOMATICALLY SET QUANTITY TO 1
                          // IF IT'S ZERO WHEN SELECT SOME CLOTHE SIZE
                          previewsQuantity === 0 ? 1 : previewsQuantity,
                          clothingIcons[key].id,
                        );
                      } else {
                        const theClotheIndex = clothingIcons[key].id - 1;
                        handleClearClothingSettings(theClotheIndex);
                      }
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: csGetSizeByID(
                          clothingIcons[key].id,
                          true,
                        ),
                      }),

                      option: (styles, {data, isFocused}) => ({
                        backgroundColor: isFocused ? '#F1FFCE' : data.color,
                        padding: 5,
                        cursor: 'pointer',
                      }),
                    }}
                  />
                  {/* END SELECT */}
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
                        undefined,
                        undefined,
                        parseInt(e.target.value),
                        clothingIcons[key].id,
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
