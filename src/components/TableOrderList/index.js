import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Table} from 'react-bootstrap';
import TableOrdersHead from '../TableOrdersHead';
import TableOrdersBody from '../TableOrdersBody';

export default function TableOrderList() {
  return (
    <Row>
      <Col>
        <Table striped bordered hover>
          <TableOrdersHead />
          <TableOrdersBody />
        </Table>
      </Col>
    </Row>
  );
}
