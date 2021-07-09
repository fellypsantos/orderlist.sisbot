import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faPen,
  faUser,
  faVenusMars,
  faDollarSign,
  faEdit,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {NavbarContainer, MainContentContainer} from './styles';
import LanguageChanger from '../LanguageChanger';

export default function App() {
  return (
    <>
      <NavbarContainer className="bg-primary">
        <Navbar
          bg="primary"
          variant="dark"
          style={{maxWidth: '980px', margin: 'auto'}}>
          <Navbar.Brand href="#home" className="mr-auto">
            Lista de Pedidos
          </Navbar.Brand>

          <LanguageChanger />
        </Navbar>
      </NavbarContainer>

      <MainContentContainer>
        <Container>
          <Row>
            <Col xs="6" sm="6" md="6" lg="3" xl="3">
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Nome:</Form.Label>

                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faUser} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    id="inlineFormInputGroupUsername"
                    placeholder="Ex: Jhon Doe"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col xs="6" sm="6" md="6" lg="3" xl="3">
              <Form.Group controlId="orderForm.">
                <Form.Label>Número:</Form.Label>

                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faPen} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    id="inlineFormInputGroupUsername"
                    placeholder="Ex: 256"
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col xs="6" sm="6" md="6" lg="3" xl="3">
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Gênero:</Form.Label>

                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faVenusMars} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control as="select">
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Infantil</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
            </Col>

            <Col xs="6" sm="6" md="6" lg="3" xl="3">
              <Form.Group>
                <Form.Label>Roupas:</Form.Label>
                <Button block style={{display: 'block'}}>
                  Configurar Lista
                </Button>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr style={{textAlign: 'center'}}>
                    <th style={{width: '50px'}}>
                      <FontAwesomeIcon icon={faDollarSign} />
                    </th>
                    <th>Nome</th>
                    <th>Número</th>
                    <th className="d-none d-sm-table-cell">C1</th>
                    <th className="d-none d-sm-table-cell">C2</th>
                    <th className="d-none d-sm-table-cell">C3</th>
                    <th className="d-none d-sm-table-cell">C4</th>
                    <th className="d-none d-sm-table-cell">C5</th>
                    <th className="d-none d-sm-table-cell">C6</th>
                    <th>-</th>
                    <th>-</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td style={{textAlign: 'center'}}>
                      <input type="checkbox" />
                    </td>
                    <td>Fellyp</td>
                    <td style={{textAlign: 'center'}}>256</td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faEdit} />
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                  </tr>

                  <tr>
                    <td style={{textAlign: 'center'}}>
                      <input type="checkbox" />
                    </td>
                    <td>Pedro</td>
                    <td style={{textAlign: 'center'}}>775</td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faEdit} />
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                  </tr>

                  <tr>
                    <td style={{textAlign: 'center'}}>
                      <input type="checkbox" />
                    </td>
                    <td>Rodrigo</td>
                    <td style={{textAlign: 'center'}}>404</td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faEdit} />
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                  </tr>

                  <tr>
                    <td style={{textAlign: 'center'}}>
                      <input type="checkbox" />
                    </td>
                    <td>Jorge</td>
                    <td style={{textAlign: 'center'}}>500</td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      1-M
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td
                      className="d-none d-sm-table-cell"
                      style={{textAlign: 'center'}}>
                      -
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faEdit} />
                    </td>
                    <td style={{textAlign: 'center'}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
        </Container>
      </MainContentContainer>
    </>
  );
}
