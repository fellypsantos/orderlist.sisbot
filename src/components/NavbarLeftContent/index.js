import React from 'react';
import {NavbarCustom} from './styles';

import MeLista from '../../images/icons/list.logo.png';

export default function NavbarLeftContent({children}) {
  return (
    <NavbarCustom variant="dark">
      <NavbarCustom.Brand href="/" className="mr-auto">
        <img src={MeLista} height="36px" alt="Logo" />
      </NavbarCustom.Brand>

      {/* Dropdown to change langhage */}
      {children}
    </NavbarCustom>
  );
}
