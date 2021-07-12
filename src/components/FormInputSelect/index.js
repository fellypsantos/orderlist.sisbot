import React, {useContext} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {OrderListContext} from '../../contexts/OrderListContext';

export default function FormInputSelect(props) {
  const {label, value, icon, arrOptions, onChange} = props;
  const {Translator} = useContext(OrderListContext);

  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>

      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FontAwesomeIcon icon={icon} />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control as="select" onChange={onChange} value={value}>
          {arrOptions.map((item) => (
            // Translated based in the item.code
            <option key={item.id} value={item.code}>
              {Translator(item.code)}
            </option>
          ))}
        </Form.Control>
      </InputGroup>
    </Form.Group>
  );
}
