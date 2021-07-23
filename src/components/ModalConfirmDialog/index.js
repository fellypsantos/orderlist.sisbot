import React, {useContext} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {OrderListContext} from '../../contexts/OrderListContext';

export default function ModalConfirmDialog({
  isOpen = false,
  title,
  textContent,
  handleConfirm,
  handleClose,
  useDangerConfirm = false,
}) {
  const {Translator} = useContext(OrderListContext);

  return (
    <Modal show={isOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{textContent}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
        <Button
          variant={!useDangerConfirm ? 'primary' : 'danger'}
          onClick={handleConfirm}>
          {Translator('CONFIRM')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
