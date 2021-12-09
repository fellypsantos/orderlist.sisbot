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

const sample = {
  tshirt: [
    {
      label: 'MASULINO',
      options: [
        {label: 'PP', value: 'T-PP'},
        {label: 'M', value: 'T-M'},
      ],
    },
    {
      label: 'FEMININO',
      options: [
        {label: 'PP', value: 'T-PP'},
        {label: 'P', value: 'T-P'},
      ],
    },
  ],
};

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
    shouldFilter,
  } = useContext(OrderListContext);

  const [clothingSizesDropDown, setClothingSizesDropDown] = useState([]);

  const filterCycling = (key) => {
    // Always return no variant clothes
    if (clothingIcons[key].isCycling === undefined) return true;

    // Only return bike or normal clothes, never both;
    if (clothingIcons[key].isCycling !== isCycling) return false;

    return true;
  };

  useEffect(() => {
    if (currentClothingPrices === null) return false; // PREVENT ERROR
    if (!modalClothesOpened) return false;

    const defaultArraySample = [
      {
        label: 'MASCULINO',
        options: [],
      },
      {
        label: 'FEMININO',
        options: [],
      },
      {
        label: 'INFANTIL',
        options: [],
      },
    ];

    /** MAIN LIST THAT HOLDS FILTERED */
    const dbGroupedDropDown = {
      tshirt: JSON.parse(JSON.stringify(defaultArraySample)),
      tshirtLong: JSON.parse(JSON.stringify(defaultArraySample)),
      shorts: JSON.parse(JSON.stringify(defaultArraySample)),
      pants: JSON.parse(JSON.stringify(defaultArraySample)),
      tanktop: JSON.parse(JSON.stringify(defaultArraySample)),
      vest: JSON.parse(JSON.stringify(defaultArraySample)),
    };

    // LOOP THROUGH EACH CLOTHE
    Object.keys(clothingIcons)
      .filter(filterCycling)
      .map((theClothe) => {
        console.warn('🟪 Generate options sizes to: ', theClothe);

        // LOOP THROUGH ALL SIZES TO THIS CLOTHE
        clothingSizes.forEach((theSize) => {
          /* * * * * * * * * * * * * * * * * * * * *
           * GENERATE OPTIONS FOR MALE
           * * * * * * * * * * * * * * * * * * * * */
          if (theSize.gender === 'MALE') {
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableMale;
            const currentPrice = targetPrices[theClothe][theSize.priceIndex];
            const newOption = {
              label: Translator(theSize.value),
              value: theSize.value,
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[theClothe][targetIndex].options.push(newOption);
            }
          } else if (theSize.gender === 'FEMALE') {
            /* * * * * * * * * * * * * * * * * * * * *
             * GENERATE OPTIONS FOR FEMALE
             * * * * * * * * * * * * * * * * * * * * */
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableFemale;
            const currentPrice = targetPrices[theClothe][theSize.priceIndex];
            const newOption = {
              label: Translator(theSize.value),
              value: theSize.value,
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[theClothe][targetIndex].options.push(newOption);
            }
          } else if (theSize.gender === 'CHILDISH') {
            /* * * * * * * * * * * * * * * * * * * * *
             * GENERATE OPTIONS FOR CHILDISH
             * * * * * * * * * * * * * * * * * * * * */
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableChildish;
            const currentPrice = targetPrices[theClothe][theSize.priceIndex];
            const newOption = {
              label: Translator(theSize.value),
              value: theSize.value,
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[theClothe][targetIndex].options.push(newOption);
            }
          }
        });

        // SAVE THE PROGRESS FOR THE CURRENT CLOTHE
        console.warn('✅ SAVE DATA FOR CURRENT CLOTHE: ', theClothe);
        console.log('💥 MAIN ', dbGroupedDropDown);
        setClothingSizesDropDown(dbGroupedDropDown);
      });
  }, [Translator, modalClothesOpened]);

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

  const csGetSizeByID = (theID, clotheName, colorOnly = false) => {
    if (!modalClothesOpened) return false;

    // const targetOrderItem = getTargetOrderItemToManipulate();

    // const settingsForClothes = targetOrderItem.clothingSettings.filter(
    //   (item) => {
    //     if (item.name.includes('Cycling') !== isCycling) return false;
    //     return true;
    //   },
    // );

    // const theSize = settingsForClothes[theID - 1].size;
    // const theGender = settingsForClothes[theID - 1].gender;
    // const theGenderIndex = Utils.ParseGenderToIndex(theGender);
    // console.log('theGender', theGender);

    // if (theSize === '' || theGender === '') return false;

    // // Filter to get previews selected value in <Select> elemment
    // const theValue = clothingSizesDropDown[clotheName][
    //   theGenderIndex
    // ].options.filter((option) => option.value === theSize);

    // const theColor = theValue.length > 0 ? theValue[0].color : '#fff';
    // return colorOnly ? theColor : theValue;
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
            .filter(filterCycling)
            // FILTER BY EMPTY PRICES
            .filter((key) => {
              if (currentClothingPrices === null) return false;

              if (!shouldFilter) return true;

              const {
                priceTableMale,
                priceTableFemale,
                priceTableChildish,
              } = currentClothingPrices;

              const clotheName = key.replace('Cycling', '');
              const clothePriceMale = priceTableMale[clotheName];
              const clothePriceFemale = priceTableFemale[clotheName];
              const clothePriceChildish = priceTableChildish[clotheName];

              // JOIN ALL PRICES FOR SAME CLOTHE
              // FROM ALL GENDERS
              const mergedClothingPrices = [].concat(
                clothePriceMale,
                clothePriceFemale,
                clothePriceChildish,
              );

              const sumResult = mergedClothingPrices.reduce(
                (total, num) => total + num,
              );

              // DECIDES TO RENDER OR NOT THE CLOTHE ON SCREEN
              // TO SELECT IT SIZE
              return sumResult > 0;
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
                    // options={sample[key]}
                    options={clothingSizesDropDown[key]}
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
                          key,
                          true,
                          '<Select /> styles',
                        ),
                      }),

                      option: (styles, {data, isFocused}) => ({
                        backgroundColor: isFocused ? '#eee' : data.color,
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
