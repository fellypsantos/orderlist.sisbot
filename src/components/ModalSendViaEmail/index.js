import React, {useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import {OrderListContext} from '../../contexts/OrderListContext';

const ModalSendViaEmail = () => {
  const {Translator} = useContext(OrderListContext);

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{labelContent}</Form.Label>
            <Form.Control
              as={useTextarea ? 'textarea' : 'input'}
              rows={5}
              value={inputTextContent}
              onChange={handleChange}
              placeholder={placeholderContent}
            />
            <Form.Text className={`text-muted ${useTextarea && 'd-none'}`}>
              {inputTextContent.length === 0
                ? Translator('INFOR_TEXT_USING_DEFAULT')
                : Translator('INFOR_TEXT_USING_CONTENT_ABOVE')}
            </Form.Text>
          </Form.Group>
        </form>
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
};

export default ModalSendViaEmail;
