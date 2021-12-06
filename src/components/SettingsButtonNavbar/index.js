import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';

const SettingsButtonNavbar = () => {
  const {setSettingsOpen} = useContext(OrderListContext);

  return (
    <Button
      variant="light"
      className="mr-1"
      onClick={() => setSettingsOpen(true)}>
      <FontAwesomeIcon icon={faCog} />
    </Button>
  );
};

export default SettingsButtonNavbar;
