import React from 'react';
import {TheLabel, TheLine, TheRow} from './styles';

const PenField = ({label}) => (
  <div>
    <TheRow>
      <TheLabel>{label}</TheLabel>
      <TheLine />
    </TheRow>
  </div>
);

export default PenField;
