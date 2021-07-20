import React, {useContext} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {OrderListContext} from '../../contexts/OrderListContext';

import TableContentCentered from '../../components/TableContentCentered';
import {AnnotationContainer} from '../../components/AnnotationsBox/styles';
import PenField from '../../components/PenField';
import ReportHeader from '../../components/ReportHeader';
import ReportMenu from '../../components/ReportMenu';

const Report = () => {
  const {orderListItems, orderListItemsNotes, clothingIcons} = useContext(
    OrderListContext,
  );

  console.log('orderListItemsNotes', orderListItemsNotes);
  console.log('orderListItems', orderListItems);

  return (
    <div>
      <Row>
        <Col>
          <ReportMenu />
        </Col>
      </Row>

      <div id="report" style={{padding: '0px 10px'}}>
        <Row className="mt-5">
          {/* LEFT SIDE */}
          <Col xs="6">
            <ReportHeader
              title="SISBot"
              subtitle="Relatório de Processamento"
              date="10 de Janeiro de 2021 - 10h31"
            />
          </Col>

          {/* RIGHT SIDE */}
          <Col xs="6">
            <PenField label="Cliente:" />
            <PenField label="Data do Pedido:" />
            <PenField label="Data de Entrega:" />
            <PenField label="Responsável:" />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col xs="6">
            <h5>MASCULINO</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </TableContentCentered>
          </Col>

          <Col xs="6">
            <h5>FEMININO</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>PP</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </TableContentCentered>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs="6">
            <h5>INFANTIL</h5>
            <TableContentCentered>
              <thead>
                <tr>
                  <th>-</th>
                  {clothingIcons.map((clothingIcon) => (
                    <th>
                      <img src={clothingIcon.icon} alt="clothing" height={25} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>6</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>8</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>10</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>12</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>16</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                  <td>-</td>
                </tr>
              </tbody>
            </TableContentCentered>
          </Col>

          <Col xs="6">
            <h5>ANOTAÇÕES</h5>
            <AnnotationContainer>
              {orderListItemsNotes.split('\n').map((line) => (
                <p>{line}</p>
              ))}
            </AnnotationContainer>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Report;
