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
    shouldFiter,
    setShouldFilter,
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
        <Modal.Title>{Translator('SETTINGS_POPUP_TITLE')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* COIN PREFIX */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">
            {Translator('SETTINGS_COIN_PREFIX')}
          </Form.Label>
          <Col sm="8">
            <Form.Control
              value={settings.coinPrefix}
              onChange={updateCoinPrefix}
            />
            <Form.Text className="text-muted">
              {Translator('SETTINGS_COIN_PREFIX_DESCRIPTION')}
              <span>{settings.coinPrefix}</span> 35
            </Form.Text>
          </Col>
        </Form.Group>

        {/* COIN PREFIX */}
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="4">
            {Translator('SETTINGS_MAX_PER_PIECE')}
          </Form.Label>
          <Col sm="8">
            <Form.Control
              value={tempMaxQuantity}
              type="number"
              onChange={({target}) => setTempMaxQuantity(target.value)}
              onBlur={updateMaxQuantity}
            />
            <Form.Text className="text-muted">
              {Translator('SETTINGS_MAX_PER_PIECE_DESCSRIPTION')}
            </Form.Text>
          </Col>
        </Form.Group>

        {/* CLOTHES FILTER */}
        <hr />
        <Form.Check
          id="nocrop"
          type="checkbox"
          label={Translator('SETTINGS_DONT_SHOW_PRICES_WITH_EMPTY_VALUE')}
          checked={shouldFiter}
          onClick={() => setShouldFilter(!shouldFiter)}
        />
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
