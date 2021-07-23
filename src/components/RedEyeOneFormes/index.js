import React, {useContext} from 'react';
import {OrderListContext} from '../../contexts/OrderListContext';
import OneFormes from '../../images/icons/oneformes.logo.svg';
import {RedEyeOneFormesRounded} from './styles';

const RedEyeOneFormes = () => {
  const {Translator} = useContext(OrderListContext);

  const handleGoToOneFormes = (e) => {
    e.preventDefault();
    window.location.href = 'https://oneformes.com';
  };

  return (
    <a
      href="#!"
      onClick={handleGoToOneFormes}
      className="mr-2"
      title={Translator('BACK_TO_HOME_ONEFORMES')}>
      <RedEyeOneFormesRounded src={OneFormes} />
    </a>
  );
};

export default RedEyeOneFormes;
