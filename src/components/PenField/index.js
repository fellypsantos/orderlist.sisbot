import React from 'react';
import {TheLabel, TheLine, TheRow} from './styles';

const PenField = ({label, value, printOnly = false}) => (
  <div className={printOnly ? 'print-only' : ''}>
    <TheRow>
      <TheLabel>{label}</TheLabel>
      <TheLine type="text" value={value} disabled />
    </TheRow>
  </div>
);

export default PenField;
