import React, {useContext} from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBicycle, faMale} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';

import {OrderListContext} from '../../contexts/OrderListContext';

const ButtonToggleClothignIcons = () => {
  const {addToast} = useToasts();
  const {isCycling, setIsCycling} = useContext(OrderListContext);

  const updateCyclingFlag = (newState) => {
    if (newState !== isCycling) {
      setIsCycling(newState);
      const currentClothe = newState === true ? 'Ciclismo' : 'Normal';

      addToast(`Utilizando roupas no estilo ${currentClothe}`, {
        appearance: 'success',
        autoDismiss: true,
      });
    }
  };

  return (
    <ButtonGroup size="sm">
      <Button
        onClick={() => updateCyclingFlag(false)}
        variant="secondary"
        className={!isCycling && 'active'}
        style={{width: 35}}>
        <FontAwesomeIcon icon={faMale} width={35} />
      </Button>

      <Button
        onClick={() => updateCyclingFlag(true)}
        variant="secondary"
        className={isCycling && 'active'}
        style={{width: 35}}>
        <FontAwesomeIcon icon={faBicycle} width={35} />
      </Button>
    </ButtonGroup>
  );
};

export default ButtonToggleClothignIcons;
