import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  DashboardBlockContainer,
  DashboardBlockLabel,
  DashboardBlockValue,
} from './styles';

const DashboardHeaderBlock = (props) => {
  const {label, value, icon, valueTextIcon = '$'} = props;

  return (
    <DashboardBlockContainer className="mb-3">
      <DashboardBlockLabel>{label}</DashboardBlockLabel>
      <div className="d-flex ">
        <DashboardBlockValue className="mr-auto">
          {`${valueTextIcon} ${value}`}
        </DashboardBlockValue>
        <FontAwesomeIcon icon={icon} style={{color: '#666'}} />
      </div>
    </DashboardBlockContainer>
  );
};

export default DashboardHeaderBlock;
