import React from 'react';
import {useHistory} from 'react-router-dom';
import {NavbarCustom} from './styles';

import MeLista from '../../images/icons/list.logo.png';

export default function NavbarLeftContent({children}) {
  const history = useHistory();

  return (
    <NavbarCustom variant="dark">
      <NavbarCustom.Brand
        className="mr-auto"
        style={{cursor: 'pointer'}}
        onClick={() => history.push('/')}>
        <img src={MeLista} height="36px" alt="Logo" />
      </NavbarCustom.Brand>

      {/* Dropdown to change langhage */}
      {children}
    </NavbarCustom>
  );
}
