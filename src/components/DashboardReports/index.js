import React, {useContext} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  faCoins,
  faHandHoldingUsd,
  faMoneyBillWave,
  faHourglassHalf,
} from '@fortawesome/free-solid-svg-icons';

import DashboardHeaderBlock from '../DashboardHeaderBlock';
import {OrderListContext} from '../../contexts/OrderListContext';

export default function DashboardReports({isVisible}) {
  const {dashboardData, Translator} = useContext(OrderListContext);

  return (
    isVisible && (
      <Row>
        <Col xs="6" sm="6" md="3" lg="3" xl="3">
          <DashboardHeaderBlock
            label={Translator('GRAND_TOTAL')}
            value={dashboardData.totalToReceive}
            icon={faCoins}
          />
        </Col>

        <Col xs="6" sm="6" md="3" lg="3" xl="3">
          <DashboardHeaderBlock
            label={Translator('TOTAL_RECEIVED')}
            value={dashboardData.totalReceived}
            icon={faHandHoldingUsd}
          />
        </Col>

        <Col xs="6" sm="6" md="3" lg="3" xl="3">
          <DashboardHeaderBlock
            label={Translator('NEED_RECEIVE')}
            value={dashboardData.needReceive}
            icon={faMoneyBillWave}
          />
        </Col>

        <Col xs="6" sm="6" md="3" lg="3" xl="3">
          <DashboardHeaderBlock
            label={Translator('TOTAL_PROGRESS')}
            value={dashboardData.totalProgressAsPercentage}
            valueTextIcon="%"
            icon={faHourglassHalf}
          />
        </Col>
      </Row>
    )
  );
}
