import React from 'react';
import OneFormes from '../../images/icons/oneformes.logo.svg';
import {RedEyeOneFormesRounded} from './styles';

const RedEyeOneFormes = () => {
  const handleGoToOneFormes = (e) => {
    e.preventDefault();
    window.location.href = 'https://oneformes.com';
  };

  return (
    <a
      href="#!"
      onClick={handleGoToOneFormes}
      className="mr-2"
      title="Voltar à página inicial do OneFormes.com">
      <RedEyeOneFormesRounded src={OneFormes} />
    </a>
  );
};

export default RedEyeOneFormes;
