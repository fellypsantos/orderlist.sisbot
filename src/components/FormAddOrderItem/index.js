import React, {useContext} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faUser,
  faPen,
  faVenusMars,
  faPlus,
  faEraser,
} from '@fortawesome/free-solid-svg-icons';

import FormTextInput from '../FormTextInput';
import FormInputSelect from '../FormInputSelect';
import {OrderListContext} from '../../contexts/OrderListContext';

const FormAddOrderItem = () => {
  const {
    setModalClothesOpened,
    genderOptions,
    tempOrderItem,
    setTempOrderItem,
    initialStateTempOrderItem,
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

  const handleChangeGender = (e) => {
    setTempOrderItem({
      ...tempOrderItem,
      gender: e.target.value.trim(),
    });
  };

  const handleClearTempOrderItem = () => {
    setTempOrderItem(initialStateTempOrderItem);
  };

  return (
    <Row>
      <Col xs="6" sm="6" md="6" lg="3" xl="3">
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

      <Col xs="6" sm="6" md="6" lg="3" xl="3">
        <FormTextInput
          icon={faPen}
          label={`${Translator('NUMBER')}:`}
          placeholder={`${Translator('EXAMPLE_ABBREV')} 256`}
          value={tempOrderItem.number}
          onChange={handleChangeNumber}
        />
      </Col>

      <Col xs="6" sm="6" md="6" lg="3" xl="3">
        <FormInputSelect
          label={`${Translator('GENDER')}:`}
          value={tempOrderItem.gender}
          icon={faVenusMars}
          arrOptions={genderOptions}
          onChange={handleChangeGender}
        />
      </Col>

      <Col xs="6" sm="6" md="6" lg="3" xl="3">
        <Form.Group>
          <Form.Label>{`${Translator('CLOTHES')}:`}</Form.Label>
          {/* Hide labels on mobile */}
          <ButtonGroup className="d-flex">
            <Button onClick={() => setModalClothesOpened(true)}>
              <FontAwesomeIcon icon={faPlus} />
              <span className="d-none d-sm-inline"> {Translator('ADD')}</span>
            </Button>
            <Button
              variant="outline-primary"
              onClick={handleClearTempOrderItem}>
              <FontAwesomeIcon icon={faEraser} />
              <span className="d-none d-sm-inline"> {Translator('CLEAR')}</span>
            </Button>
          </ButtonGroup>
        </Form.Group>
      </Col>
    </Row>
  );
};

export default FormAddOrderItem;
