import React, {useContext, useState, useEffect} from 'react';
import {useToasts} from 'react-toast-notifications';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Switch from 'react-switch';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-select';
import {v4 as uuidv4} from 'uuid';

import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

export default function ModalSequencialList({isOpen = false}) {
  const {
    Translator,
    clothingIcons,
    clothingSizes,
    currentClothingPrices,
    isCycling,
    tempOrderItem,
    orderListItems,
    setOrderListItems,
    setModalSequencialListOpen,
    modalSequencialListOpen,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const [checkboxList, setCheckboxList] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const clothingNames = [
    'tshirt',
    'tshirtLong',
    'shorts',
    'pants',
    'tanktop',
    'vest',
    'socks',
  ];

  const [clothingSizesDropDown, setClothingSizesDropDown] = useState([]);
  const [selectedClothingSize, setSelectedClothingSize] = useState('');
  const [initialValue, setInitialValue] = useState(0);
  const [finalValue, setFinalValue] = useState(0);

  const handleClose = () => {
    const defaultOptions = checkboxList.map(() => false);
    setCheckboxList(defaultOptions);
    setSelectedClothingSize('');
    setInitialValue(0);
    setFinalValue(0);
    setModalSequencialListOpen(false);
  };

  const handleConfirm = () => {
    // VALIDATE DATA

    const toastSettingError = {
      autoDismiss: true,
      appearance: 'error',
    };

    const countChecked = checkboxList.filter((checked) => checked === true);

    if (countChecked.length === 0) {
      addToast(Translator('TOAST_SELECT_SOME_CLOTHE'), toastSettingError);
      return false;
    }

    if (initialValue === finalValue) {
      addToast(Translator('TOAST_RANGE_CONFLICT'), toastSettingError);
      return false;
    }

    if (initialValue > finalValue) {
      addToast(Translator('TOAST_RANGE_INVALID'), toastSettingError);
      return false;
    }

    if (selectedClothingSize === '') {
      addToast(Translator('TOAST_NO_SIZE_SELECTED'), toastSettingError);
      return false;
    }

    const listOfGeneratedOrderItems = [];

    for (let i = initialValue; i <= finalValue; i += 1) {
      // GENERATE CLOTHING SETTINGS DATA
      const generatedClothingSettings = clothingNames.map((theName, index) => {
        const canGenerate = checkboxList[index] === true;
        return {
          id: index + 1,
          name: index <= 3 && isCycling ? `${theName}Cycling` : theName,
          size: canGenerate ? selectedClothingSize.value : '',
          gender: canGenerate ? selectedClothingSize.gender : '',
          quantity: canGenerate ? 1 : 0,
        };
      });

      // CALCULATE PAYMENT VALUE BASED IN PRICES DATA
      const paymentPriceForNewOrderItem =
        Utils.CalculatePaymentValueToOrderItem(
          currentClothingPrices,
          clothingSizes,
          generatedClothingSettings,
        );

      // GENERATE COMPLETED OBJECT WITH NEW ORDER ITEM
      const generatedOrderItem = {
        ...tempOrderItem,
        id: uuidv4(),
        number: i,
        clothingSettings: generatedClothingSettings,
        payment: {
          paid: false,
          value: paymentPriceForNewOrderItem,
        },
      };

      listOfGeneratedOrderItems.push(generatedOrderItem);
    }

    // ADD ALL NEW ORDER ITEMS TO MAIN LIST
    setOrderListItems([...orderListItems, ...listOfGeneratedOrderItems]);

    addToast(Translator('TOAST_SEQUENCIAL_LIST_WAS_GENERATED'), {
      autoDismiss: true,
      appearance: 'success',
    });

    handleClose();
    setModalSequencialListOpen(false);
  };

  const handleChangeSwitch = (value, index) => {
    const updated = checkboxList.map((it, idx) => (idx === index ? value : it));
    setCheckboxList(updated);
  };

  const handleChangeSelect = (item) => {
    if (item === null) setSelectedClothingSize('');
    else setSelectedClothingSize(item);
  };

  const customStyle = {
    control: (styles) => ({
      ...styles,
      backgroundColor:
        selectedClothingSize !== null ? selectedClothingSize.color : '',
    }),

    option: (styles, {data, isFocused}) => ({
      backgroundColor: isFocused ? '#eee' : data.color,
      padding: 5,
      cursor: 'pointer',
    }),
  };

  useEffect(() => {
    if (!modalSequencialListOpen) return false;

    const maleSizes = [];
    const femaleSizes = [];
    const childSizes = [];

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
  }, [modalSequencialListOpen]);

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translator('SEQUENCIAL_LIST')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{Translator('SEQUENCIAL_LIST_DESCRIPTION')}</p>

        <Container>
          <Row className="mt-4 mb-2">
            {Utils.FilterClothesByMode(clothingIcons, isCycling).map(
              (key, index) => (
                <Col xs={4} sm={2} className="mb-4" key={key}>
                  <div className="d-flex flex-column align-items-center">
                    <img
                      className="mb-2"
                      src={clothingIcons[key].icon}
                      alt="icon"
                      width={40}
                      height={40}
                    />
                    <Switch
                      onChange={(value) => handleChangeSwitch(value, index)}
                      checked={checkboxList[index]}
                      height={22}
                      width={45}
                    />
                  </div>
                </Col>
              ),
            )}
          </Row>
          <Row>
            <Col xs={12} sm={3}>
              <Form.Group>
                <Form.Label>{Translator('SEQUENCY_START_NUMBER')}</Form.Label>
                <Form.Control
                  type="number"
                  value={initialValue}
                  onChange={({target}) => {
                    setInitialValue(parseInt(target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label>{Translator('SEQUENCY_END_NUMBER')}</Form.Label>
                <Form.Control
                  type="number"
                  value={finalValue}
                  onChange={({target}) => {
                    setFinalValue(parseInt(target.value));
                  }}
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={5}>
              <Form.Group>
                <Form.Label>{Translator('SIZE')}</Form.Label>
                <Select
                  isClearable
                  options={clothingSizesDropDown}
                  value={selectedClothingSize}
                  onChange={handleChangeSelect}
                  styles={customStyle}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <small className="text-muted">
                {Translator('SEQUENCY_WARNING_FILTER_DISABLED')}
              </small>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {Translator('GENERATE')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
