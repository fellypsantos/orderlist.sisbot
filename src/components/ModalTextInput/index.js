import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ModalTextInput = ({
  title,
  inputTextContent,
  labelContent,
  placeholderContent,
  isOpen,
  handleChange,
  handleConfirm,
  handleClose,
  useTextarea,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleConfirm(true);
  };

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
                ? 'Você pode deixar o campo vazio, o nome padrão acima será usado.'
                : 'Ótimo! Vamos salvar com esse nome.'}
            </Form.Text>
          </Form.Group>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fechar
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTextInput;
