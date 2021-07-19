import React from 'react';
import {NavbarCustom} from './styles';

export default function NavbarLeftContent(props) {
  const {children} = props;
  return (
    <NavbarCustom bg="primary" variant="dark">
      <NavbarCustom.Brand href="/" className="mr-auto">
        SISBot
      </NavbarCustom.Brand>

      {/* Dropdown to change langhage */}
      {children}
    </NavbarCustom>
  );
}
