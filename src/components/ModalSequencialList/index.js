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

import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

export default function ModalSequencialList({isOpen = false}) {
  const {
    Translator,
    clothingIcons,
    clothingSizes,
    isCycling,
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
  ]);

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
      addToast(
        'Selecione alguma peça de roupa antes de continuar.',
        toastSettingError,
      );
      return false;
    }

    if (initialValue === finalValue) {
      addToast(
        'O número inicial e final não podem ser os mesmos.',
        toastSettingError,
      );
      return false;
    }

    if (initialValue > finalValue) {
      addToast(
        'O número inicial é maior que o número final, não é possível gerar uma sequência.',
        toastSettingError,
      );
      return false;
    }

    if (selectedClothingSize === '') {
      addToast(
        'Selecione um tamanho para a lista sequencial.',
        toastSettingError,
      );
      return false;
    }

    for (let i = initialValue; i <= finalValue; i += 1) {
      console.log('Generate item: ', i);
    }

    addToast('Sua lista foi gerada com sucesso.', {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  const handleChangeSwitch = (value, index) => {
    const updated = checkboxList.map((it, idx) => (idx === index ? value : it));
    setCheckboxList(updated);
  };

  const handleChangeSelect = (item) => {
    console.log('selected', item);
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
    console.log('janela abriu');

    console.warn('🔶 filter was disabled by default here');

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
        <Modal.Title>Lista Sequencial</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Selecione abaixo quais peças de roupa serão usadas para cada item da
          lista sequêncial.
        </p>

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
                <Form.Label>Num. Inicial</Form.Label>
                <Form.Control
                  type="number"
                  value={initialValue}
                  onChange={({target}) => setInitialValue(target.value)}
                  placeholder="1"
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
              <Form.Group>
                <Form.Label>Num. Final</Form.Label>
                <Form.Control
                  type="number"
                  value={finalValue}
                  onChange={({target}) => setFinalValue(target.value)}
                  placeholder="2"
                />
              </Form.Group>
            </Col>

            <Col xs={12} sm={5}>
              <Form.Group>
                <Form.Label>Tamanho</Form.Label>
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
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          {Translator('CONFIRM')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
