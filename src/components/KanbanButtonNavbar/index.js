import React from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThLarge} from '@fortawesome/free-solid-svg-icons';

const KanbanButtonNavbar = () => (
  <Button onClick={() => null}>
    <FontAwesomeIcon icon={faThLarge} />
  </Button>
);

export default KanbanButtonNavbar;
