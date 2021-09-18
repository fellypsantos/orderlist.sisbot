import React, {useContext, useRef} from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {OrderListContext} from '../../contexts/OrderListContext';
import AnimatedCheckmark from '../AnimatedCheckmark';
import AnimatedLoading from '../AnimatedLoading';

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
  hcaptchaEnabled = false,
  hcaptchaSolved,
  loadingRequest = null,
  hideHelpText = false,
}) => {
  const {Translator} = useContext(OrderListContext);
  const HCaptchaRef = useRef();

  const handleResetCaptcha = () => {
    if (HCaptchaRef.current !== undefined && HCaptchaRef.current !== null) {
      HCaptchaRef.current.resetCaptcha();
    }
  };

  const beforeHandleClose = () => {
    handleClose();
    handleResetCaptcha();
  };

  const beforeHandleConfirm = () => {
    handleResetCaptcha();
    handleConfirm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    beforeHandleConfirm();
  };

  return (
    <Modal show={isOpen} onHide={beforeHandleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loadingRequest === null && (
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
              <Form.Text
                className={`text-muted ${
                  useTextarea || (hideHelpText && 'd-none')
                }`}>
                {inputTextContent.length === 0
                  ? Translator('INFOR_TEXT_USING_DEFAULT')
                  : Translator('INFOR_TEXT_USING_CONTENT_ABOVE')}
              </Form.Text>
            </Form.Group>
            {/* HCAPTCHA */}
            {hcaptchaEnabled && (
              <HCaptcha
                ref={HCaptchaRef}
                sitekey="4d60202c-b4fe-4d13-829a-235c0d7c997e"
                onVerify={(token, ekey) => {
                  hcaptchaSolved(token);
                }}
              />
            )}
          </form>
        )}

        {/* LOADER */}
        {loadingRequest === true && (
          <AnimatedLoading displayText={Translator('SENDING_MAIL')} />
        )}

        {/* CHECKMARK */}
        {loadingRequest === false && (
          <AnimatedCheckmark displayText={Translator('EMAIL_SENT')} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {Translator('CLOSE')}
        </Button>
        {loadingRequest === null && (
          <Button variant="primary" onClick={beforeHandleConfirm}>
            {Translator('CONFIRM')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTextInput;
