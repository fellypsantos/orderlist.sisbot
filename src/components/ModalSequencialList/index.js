import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Switch from 'react-switch';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

export default function ModalSequencialList({
  isOpen = false,
  handleConfirm,
  handleClose,
}) {
  const {Translator, clothingIcons, isCycling, clothingSizes} =
    useContext(OrderListContext);

  const [checkboxList, setCheckboxList] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleChangeSwitch = (value, index) => {
    const updated = checkboxList.map((it, idx) => (idx === index ? value : it));
    setCheckboxList(updated);
  };

  return (
    <Modal show={false} onHide={handleClose}>
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
                <Col xs={4} sm={2} className="mb-4">
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
            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Número Inicial</Form.Label>
                <Form.Control type="number" placeholder="1" />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Número Final</Form.Label>
                <Form.Control type="number" placeholder="10" />
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Gênero</Form.Label>
                <Form.Control
                  as="select"
                  className="my-1 mr-sm-2"
                  custom
                  value={1}
                  onChange={() => {}}>
                  <option value={0}>0 {Translator('PIECES')}</option>

                  {clothingSizes.map((theSize) => (
                    <option value={theSize.value}>{theSize.value}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>

            <Col xs={12} sm={6}>
              <Form.Group>
                <Form.Label>Tamanho</Form.Label>
                <Form.Control type="text" placeholder="GG" />
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
