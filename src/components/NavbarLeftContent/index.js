import React from 'react';
import {NavbarCustom} from './styles';

import MeLista from '../../images/icons/melista.logo.svg';

export default function NavbarLeftContent({children}) {
  return (
    <NavbarCustom bg="primary" variant="dark">
      <NavbarCustom.Brand href="/" className="mr-auto">
        <img src={MeLista} height="36px" alt="hue" />
      </NavbarCustom.Brand>

      {/* Dropdown to change langhage */}
      {children}
    </NavbarCustom>
  );
}
