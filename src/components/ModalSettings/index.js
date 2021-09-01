import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {OrderListContext} from '../../contexts/OrderListContext';

const ModalSettings = () => {
  const {
    Translator,
    isSettingsOpen,
    setSettingsOpen,
    settings,
    setSettings,
  } = useContext(OrderListContext);

  const [tempMaxQuantity, setTempMaxQuantity] = useState(50);

  const handleClose = () => setSettingsOpen(false);

  const updateCoinPrefix = ({target}) =>
    setSettings({
      ...settings,
      coinPrefix: target.value.trim(),
    });

  const updateMaxQuantity = () => {
    setSettings({
      ...settings,
      maxQuantityPerClothe: parseInt(tempMaxQuantity) || 1,
    });
  };

  return (
    <Modal show={isSettingsOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Configurações</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* COIN PREFIX */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">
            Prefixo de Moeda
          </Form.Label>
          <Col sm="8">
            <Form.Control
              value={settings.coinPrefix}
              onChange={updateCoinPrefix}
            />
            <Form.Text className="text-muted">
              Esse prefixo de moeda será usado para os valores do sistema. Ex:{' '}
              <span>{settings.coinPrefix}</span> 35
            </Form.Text>
          </Col>
        </Form.Group>

        {/* COIN PREFIX */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">
            Máximo por Peça
          </Form.Label>
          <Col sm="8">
            <Form.Control
              value={tempMaxQuantity}
              type="number"
              onChange={({target}) => setTempMaxQuantity(target.value)}
              onBlur={updateMaxQuantity}
            />
            <Form.Text className="text-muted">
              Valor máximo que pode ser pedido para cada peça de roupa.
            </Form.Text>
          </Col>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSettings;
