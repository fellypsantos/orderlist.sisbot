import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';

const RedEyeOneFormes = () => {
  const {Translator} = useContext(OrderListContext);

  const handleGoToOneFormes = () => {
    window.location.href = 'https://oneformes.com';
  };

  return (
    <Button
      className="mr-1"
      variant="light"
      onClick={handleGoToOneFormes}
      title={Translator('BACK_TO_HOME_ONEFORMES')}>
      <FontAwesomeIcon icon={faEye} />
    </Button>
  );
};

export default RedEyeOneFormes;
