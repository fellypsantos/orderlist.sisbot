import React from 'react';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import {TheInput} from './styles';

const defaultMaskOptions = {
  prefix: '$ ',
  suffix: '',
  includeThousandsSeparator: false,
  allowDecimal: true,
  decimalSymbol: '.',
  decimalLimit: 0, // how many digits allowed after the decimal
  integerLimit: 4, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
};

const TableCellAsInput = ({value, handleChange, handleBlur}) => {
  const currencyMask = createNumberMask(defaultMaskOptions);
  return (
    <TheInput
      mask={currencyMask}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
};

export default TableCellAsInput;
