import React from 'react';
import {IconSpinner} from './styles';

const FontAwesomeIconSpinner = ({icon, speed = 1000}) => (
  <IconSpinner icon={icon} speed={speed} />
);

export default FontAwesomeIconSpinner;
