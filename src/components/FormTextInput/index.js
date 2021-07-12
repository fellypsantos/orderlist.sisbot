import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function FormTextInput(props) {
  const {label, value, placeholder, icon, onChange} = props;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>

      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FontAwesomeIcon icon={icon} />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </InputGroup>
    </Form.Group>
  );
}
