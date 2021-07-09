import React from 'react';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import {NavbarContainer} from './styles';
import LanguageChanger from '../LanguageChanger';

export default function App() {
  return (
    <>
      <NavbarContainer className="bg-primary">
        <Navbar
          bg="primary"
          variant="dark"
          style={{maxWidth: '980px', margin: 'auto'}}>
          <Navbar.Brand href="#home">Lista de Pedidos</Navbar.Brand>

          <Nav className="mr-auto">
            {/* <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link> */}
          </Nav>

          <LanguageChanger />

          {/* <DropdownButton
            id="dropdown-basic-button"
            title="Idioma"
            menuAlign="right">
            <Dropdown.Item href="#!">
              <span className="flag-icon flag-icon-br" />
              Portugês
            </Dropdown.Item>

            <Dropdown.Item href="#!">English</Dropdown.Item>
            <Dropdown.Item href="#!">Spañol</Dropdown.Item>
          </DropdownButton> */}
        </Navbar>
      </NavbarContainer>
    </>
  );
}
