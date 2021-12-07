import React from 'react';
import Datetime from 'react-datetime';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import 'react-datetime/css/react-datetime.css';

const DateTimePickerCustom = (mainProps) => {
  const renderInput = (innerProps) => (
    <InputGroup className="mb-2">
      <InputGroup.Prepend>
        <InputGroup.Text>{mainProps.label}</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl {...innerProps} />
    </InputGroup>
  );

  return (
    <Datetime
      closeOnSelect={mainProps.closeOnSelect}
      renderInput={renderInput}
      value={mainProps.value}
      locale={mainProps.locale}
      timeFormat={mainProps.timeFormat}
      onChange={mainProps.onChange}
    />
  );
};

export default DateTimePickerCustom;
