import React from 'react';
import {TheLabel, TheLine, TheRow} from './styles';

const PenField = ({label, value}) => (
  <div>
    <TheRow>
      <TheLabel>{label}</TheLabel>
      <TheLine type="text" value={value} disabled />
    </TheRow>
  </div>
);

export default PenField;
