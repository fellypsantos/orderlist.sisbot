import React, {useContext, useState} from 'react';
import Form from 'react-bootstrap/Form';
import {Modal, Row, Col, Button } from 'react-bootstrap';
import {v4 as uuidv4} from 'uuid';
import Switch from 'react-switch';
import {useToasts} from 'react-toast-notifications';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

const sanitizeList = (list) => (
  list.split('\n')
    .map((item) => item.split(','))
);

const createOrderItem = (name, number, size, gender, clothingTypes) => {
  const clothingSettings = [
    {id: 1, name: 'tshirt', size: 'T-P', gender: 'MALE', quantity: 0},
    {id: 2, name: 'tshirtLong', size: '', gender: '', quantity: 0},
    {id: 3, name: 'shorts', size: '', gender: '', quantity: 0},
    {id: 4, name: 'pants', size: '', gender: '', quantity: 0},
    {id: 5, name: 'tanktop', size: '', gender: '', quantity: 0},
    {id: 6, name: 'vest', size: '', gender: '', quantity: 0},
    {id: 7, name: 'socks', size: '', gender: '', quantity: 0},
  ];
  clothingTypes.map((position) => {
    if (position === 6) {
      clothingSettings[position] = {
        ...clothingSettings[position],
        size: 'Tam.Uni',
        gender,
        quantity: 1,
      };
      return;
    }
    clothingSettings[position] = {
      ...clothingSettings[position],
      size,
      gender,
      quantity: 1,
    };
  });

  return {
    id: uuidv4(),
    number,
    name,
    clothingSettings,
    payment: {
      paid: false,
      value: 0,
    },
  };
};

const ModalPasteList = ({isOpen, handleClose}) => {
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
  const [gender, setGender] = useState('default');
  const [textArea, setTextArea] = useState('');
  const {
    Translator,
    clothingIcons,
    isCycling,
    setOrderListItems,
  } = useContext(OrderListContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    const list = sanitizeList(textArea);
    const listChild = list.some((item) => Number(item[item.length - 1]));
    if (listChild && gender !== 'CHILDISH') {
      addToast(Translator('TOAST_TEXT_PASTED_ERROR'), {
        autoDismiss: true,
        appearance: 'error',
      });
      return;
    }
    const clothesSetup = checkboxList.reduce((acc, curr, index) => {
      if (index === 0 && curr) return [index];
      if (index === 0) return [];
      if (curr)acc.push(index);
      return acc;
    }, []);
    list.forEach((item) => {
      if (item.length === 2) {
        if (Number(item[0])) {
          console.log('numero', 'tamanho');
          const [number, size] = item;
          const res = createOrderItem('', number, size, gender, clothesSetup);
          setOrderListItems((currList) => [...currList, res]);
          return;
        }
        console.log('nome', 'tamanho');
        const [name, size] = item;
        const res = createOrderItem(name, '', size, gender, clothesSetup);
        setOrderListItems((currList) => [...currList, res]);
        return;
      }
      const [name, number, size] = item;
      const res = createOrderItem(name, number, size, gender, clothesSetup);
      setOrderListItems((currList) => [...currList, res]);
    });

    addToast(Translator('TOAST_TEXT_PASTED'), {
      autoDismiss: true,
      appearance: 'success',
    });
    handleClose();
  };

  const handleChangeSwitch = (value, index) => {
    const updated = checkboxList.map((it, idx) => (idx === index ? value : it));
    setCheckboxList(updated);
  };

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translator('PASTE_LIST')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mt-4 mb-2">
          {Utils.FilterClothesByMode(clothingIcons, isCycling).map(
              (key, index) => (
                <Col xs={4} sm={2} className="mb-4" key={`${key}_icon`}>
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
        <form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Control
              as="select"
              size="ls"
              aria-label="select gender"
              onChange={({target}) => setGender(target.value)}
            >
              <option value="default">{Translator('CSVID_GENDER')}</option>
              <option value="MALE">{Translator('MALE')}</option>
              <option value="FEMALE">{Translator('FEMALE')}</option>
              <option value="CHILDISH">{Translator('CHILDISH')}</option>
            </Form.Control>
            <Form.Control
              name="list"
              as="textarea"
              className="mt-4"
              placeholder={Translator('TEXTAREA_PLACEHOLDER_LIST')}
              style={{ height: '100px' }}
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              />
          </Form.Group>
          <Button
            disabled={!checkboxList.some((item) => item) || gender === 'default'}
            size="lg"
            block
            type="submit"
            >
            {Translator('PASTE_LIST')}
          </Button>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPasteList;
