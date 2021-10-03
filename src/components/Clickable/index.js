import React from 'react';

import {ItemToClick} from './styles.';

const Clickable = ({children, className = '', title = '', handleClick}) => (
  <ItemToClick className={className} title={title} onClick={handleClick}>
    {children}
  </ItemToClick>
);

export default Clickable;
