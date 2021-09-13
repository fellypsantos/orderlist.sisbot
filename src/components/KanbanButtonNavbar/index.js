import React from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faThLarge} from '@fortawesome/free-solid-svg-icons';

const KanbanButtonNavbar = () => {
  const OpenKanBan = () => {
    window.location.href = '/kanban';
  };

  return (
    <Button onClick={() => OpenKanBan()}>
      <FontAwesomeIcon icon={faThLarge} />
    </Button>
  );
};

export default KanbanButtonNavbar;
