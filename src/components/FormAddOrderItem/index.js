import React, {useContext} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser, faPen, faPlus} from '@fortawesome/free-solid-svg-icons';

import FormTextInput from '../FormTextInput';
import {OrderListContext} from '../../contexts/OrderListContext';

const FormAddOrderItem = () => {
  const {
    setModalClothesOpened,
    tempOrderItem,
    setTempOrderItem,
    Translator,
  } = useContext(OrderListContext);

  const handleChangeName = (e) => {
    setTempOrderItem({
      ...tempOrderItem,
      name: e.target.value,
    });
  };

  const handleChangeNumber = (e) => {
    setTempOrderItem({
      ...tempOrderItem,
      number: e.target.value.trim(),
    });
  };

  return (
    <Row>
      <Col xs="6" sm="6" md="5" lg="5" xl="5">
        <FormTextInput
          icon={faUser}
          label={`${Translator('NAME')}:`}
          placeholder={`${Translator('EXAMPLE_ABBREV')}${Translator(
            'NAME_PLACEHOLDER',
          )}`}
          value={tempOrderItem.name}
          onChange={handleChangeName}
        />
      </Col>

      <Col xs="6" sm="6" md="3" lg="4" xl="4">
        <FormTextInput
          icon={faPen}
          label={`${Translator('NUMBER')}:`}
          placeholder={`${Translator('EXAMPLE_ABBREV')} 256`}
          value={tempOrderItem.number}
          onChange={handleChangeNumber}
        />
      </Col>

      <Col xs="12" sm="12" md="4" lg="3" xl="3">
        <Form.Group>
          <Form.Label>{`${Translator('CLOTHES')}:`}</Form.Label>
          {/* Hide labels on mobile */}
          <ButtonGroup className="d-flex">
            <Button onClick={() => setModalClothesOpened(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="d-none d-sm-inline"> {Translator('ADD')}</span>
            </Button>
          </ButtonGroup>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default FormAddOrderItem;
