import React, {useContext, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

import {ReportContext} from '../../contexts/ReportContext';
import {OrderListContext} from '../../contexts/OrderListContext';

const ModalEditReportHeader = () => {
  const {Translator} = useContext(OrderListContext);
  const {
    modalEditHeaderOpen,
    setModalEditHeaderOpen,
    setHeaderReportData,
  } = useContext(ReportContext);

  // TRANSLATE MOMENTJS FORMAT
  moment.locale(Translator('MOMENTJS'));

  const [tempClientName, setTempClientName] = useState('');
  const [tempResponsibleName, setTempResponsibleName] = useState('');
  const [tempOrderDate, setTempOrderDate] = useState(moment());
  const [tempDeliveryDate, setTempDeliveryDate] = useState(moment());

  const handleClose = () => {
    setModalEditHeaderOpen(false);
  };

  const handleChangeClientName = ({target}) => setTempClientName(target.value);

  const handleChangeResponsibleName = ({target}) =>
    setTempResponsibleName(target.value);

  const handleChangeOrderDate = (value) => setTempOrderDate(value);

  const handleChangeDeliveryDate = (value) => setTempDeliveryDate(value);

  const handleConfirm = () => {
    setHeaderReportData({
      clientName: tempClientName,
      responsableName: tempResponsibleName,
      orderDate: tempOrderDate || null,
      deliveryDate: tempDeliveryDate || null,
    });

    setModalEditHeaderOpen(false);
    console.log('Header data was setted.');
  };

  return (
    <Modal show={modalEditHeaderOpen} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Dados do Cabeçalho</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* CLIENT */}
          <Form.Group className="mb-3">
            <Form.Label>Nome do Cliente:</Form.Label>
            <Form.Control
              type="text"
              value={tempClientName}
              onChange={handleChangeClientName}
            />
          </Form.Group>

          {/* RESPONSABLE */}
          <Form.Group className="mb-3">
            <Form.Label>Nome do Responsável:</Form.Label>
            <Form.Control
              type="text"
              value={tempResponsibleName}
              onChange={handleChangeResponsibleName}
            />
          </Form.Group>

          <Row>
            <Col>
              {/* Order Date */}
              <Form.Group className="mb-3">
                <Form.Label>Data do Pedido:</Form.Label>
                <Datetime
                  closeOnSelect
                  locale={Translator('MOMENTJS')}
                  value={tempOrderDate}
                  onChange={handleChangeOrderDate}
                  timeFormat={false}
                />
              </Form.Group>
            </Col>

            <Col>
              {/* Delivery Date */}
              <Form.Group className="mb-3">
                <Form.Label>Data de Entrega:</Form.Label>
                <Datetime
                  closeOnSelect
                  locale={Translator('MOMENTJS')}
                  value={tempDeliveryDate}
                  onChange={handleChangeDeliveryDate}
                  timeFormat={false}
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
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

export default ModalEditReportHeader;
