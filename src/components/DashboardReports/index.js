import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  faCoins,
  faHandHoldingUsd,
  faMoneyBillWave,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

import DashboardHeaderBlock from '../DashboardHeaderBlock';

export default function DashboardReports() {
  return (
    <Row>
      <Col xs="6" sm="6" md="3" lg="3" xl="3">
        <DashboardHeaderBlock label="Total Geral" value="845" icon={faCoins} />
      </Col>

      <Col xs="6" sm="6" md="3" lg="3" xl="3">
        <DashboardHeaderBlock
          label="Total Recebido"
          value="250"
          icon={faHandHoldingUsd}
        />
      </Col>

      <Col xs="6" sm="6" md="3" lg="3" xl="3">
        <DashboardHeaderBlock
          label="Falta Receber"
          value="595"
          icon={faMoneyBillWave}
        />
      </Col>

      <Col xs="6" sm="6" md="3" lg="3" xl="3">
        <DashboardHeaderBlock
          label="Progresso Total"
          value="25"
          valueTextIcon="%"
          icon={faHourglassHalf}
        />
      </Col>
    </Row>
  );
}
