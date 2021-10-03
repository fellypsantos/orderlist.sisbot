import React, {useContext} from 'react';
import {OrderListContext} from '../../contexts/OrderListContext';
import OneFormes from '../../images/icons/oneformes.logo.svg';
import Clickable from '../Clickable';
import {RedEyeOneFormesRounded} from './styles';

const RedEyeOneFormes = () => {
  const {Translator} = useContext(OrderListContext);

  const handleGoToOneFormes = () => {
    window.location.href = 'https://oneformes.com';
  };

  return (
    <Clickable
      handleClick={handleGoToOneFormes}
      title={Translator('BACK_TO_HOME_ONEFORMES')}
      className="mr-2">
      <RedEyeOneFormesRounded src={OneFormes} />
    </Clickable>
  );
};

export default RedEyeOneFormes;
