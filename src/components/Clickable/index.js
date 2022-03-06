import React from 'react';

import {ItemToClick} from './styles.';

const Clickable = ({
  children,
  className = '',
  title = '',
  handleClick,
  disabled = false,
}) => (
  <ItemToClick
    className={className}
    title={title}
    onClick={handleClick}
    disabled={disabled}>
    {children}
  </ItemToClick>
);

export default Clickable;
