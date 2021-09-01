import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  DashboardBlockContainer,
  DashboardBlockLabel,
  DashboardBlockValue,
} from './styles';
import {OrderListContext} from '../../contexts/OrderListContext';

const DashboardHeaderBlock = (props) => {
  const {settings} = useContext(OrderListContext);

  const {label, value, icon} = props;

  return (
    <DashboardBlockContainer className="mb-3">
      <DashboardBlockLabel>{label}</DashboardBlockLabel>
      <div className="d-flex ">
        <DashboardBlockValue className="mr-auto">
          {`${settings.coinPrefix} ${value}`}
        </DashboardBlockValue>
        <FontAwesomeIcon icon={icon} style={{color: '#666'}} />
      </div>
    </DashboardBlockContainer>
  );
};

export default DashboardHeaderBlock;
