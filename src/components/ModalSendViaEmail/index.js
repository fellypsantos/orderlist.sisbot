import React, {useState, useContext, useRef} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import {OrderListContext} from '../../contexts/OrderListContext';
import AnimatedLoading from '../AnimatedLoading';
import AnimatedCheckmark from '../AnimatedCheckmark';

const ModalSendViaEmail = ({
  isOpen,
  handleClose,
  handleConfirm,
  email,
  handleChangeEmail,
  name,
  handleChangeName,
  hcaptchaSolved,
  requestLoading = null,
}) => {
  const {Translator} = useContext(OrderListContext);

  const HCaptchaRef = useRef();

  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleResetCaptcha = () => {
    if (HCaptchaRef.current !== undefined && HCaptchaRef.current !== null) {
      HCaptchaRef.current.resetCaptcha();
    }
  };

  const beforeHandleClose = () => {
    handleResetCaptcha();
    handleClose();
  };

  const handleBeforeConfirm = () => {
    if (!termsAccepted) return;
    handleResetCaptcha();
    handleConfirm();
  };

  return (
    <Modal show={isOpen} onHide={beforeHandleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{Translator('MODAL_TITLE_SENT_VIA_EMAIL')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form
          onSubmit={handleConfirm}
          className={requestLoading !== null ? 'd-none' : ''}>
          {/* ASK EMAIL */}
          <Form.Group className="mb-3">
            <Form.Label>{Translator('ASK_DESTINATION_EMAIL')}</Form.Label>
            <Form.Control
              as="input"
              rows={5}
              value={email}
              onChange={handleChangeEmail}
              placeholder="sample@server.com"
            />
          </Form.Group>

          {/* ASK CLIENT NAME */}
          <Form.Group className="mb-3">
            <Form.Label>{Translator('ASK_CLIENT_NAME')}</Form.Label>
            <Form.Control
              as="input"
              rows={5}
              value={name}
              onChange={handleChangeName}
              placeholder="Jorge Washington"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{Translator('ASK_NOT_ROBOT')}</Form.Label>
            {/* HCAPTCHA */}
            <HCaptcha
              ref={HCaptchaRef}
              sitekey="3bb7ba5e-5cba-4ef6-88ca-8577ac7d5236"
              onVerify={(token) => {
                hcaptchaSolved(token);
              }}
            />
          </Form.Group>

          {/* ACCEPT TERMS */}
          <Alert variant={!termsAccepted ? 'danger' : 'success'}>
            <Alert.Heading>{Translator('ACCEPTANCE_TERM_TITLE')}</Alert.Heading>
            <p>{Translator('ACCEPTANCE_TERM_TEXT')}</p>
            <hr />
            <Form.Check type="checkbox" id="checkbox-accept-terms">
              <Form.Check.Input
                type="checkbox"
                isValid={termsAccepted}
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
              />
              <Form.Check.Label>
                {Translator('ACCEPTANCE_CHECKBOX_LABEL')}
              </Form.Check.Label>
              <Form.Control.Feedback type="valid">
                {Translator('ACCEPTANCE_CHECKBOX_CHECKED')}
              </Form.Control.Feedback>
            </Form.Check>
          </Alert>
        </form>

        {/* LOADER */}
        {requestLoading === true && (
          <AnimatedLoading displayText={Translator('SENDING_MAIL')} />
        )}

        {/* CHECKMARK */}
        {requestLoading === false && (
          <AnimatedCheckmark displayText={Translator('EMAIL_SENT')} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={beforeHandleClose}>
          {Translator('CLOSE')}
        </Button>
        {requestLoading === null && termsAccepted && (
          <Button variant="primary" onClick={handleBeforeConfirm}>
            {Translator('CONFIRM')}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ModalSendViaEmail;
