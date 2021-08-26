import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faBicycle,
  faEye,
  faEyeSlash,
  faMale,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import Title from '../../components/Title';
import Separator from '../../components/Separator';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';

const Main = () => {
  const {Translator, showDashboard, setShowDashboard} = useContext(
    OrderListContext,
  );

  return (
    <>
      <FormAddOrderItem />
      <Separator />
      <div
        className="d-flex"
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Title text={Translator('MAIN_TITLE')} />
        <div>
          <ButtonGroup aria-label="Basic example" size="sm" className="mr-1">
            <Button variant="secondary" style={{width: 35}}>
              <FontAwesomeIcon icon={faMale} width={35} />
            </Button>

            <Button variant="secondary" style={{width: 35}}>
              <FontAwesomeIcon icon={faBicycle} width={35} />
            </Button>
          </ButtonGroup>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDashboard(!showDashboard)}>
            <FontAwesomeIcon
              icon={showDashboard ? faEyeSlash : faEye}
              width={35}
            />
            <span className="ml-1 d-none d-md-inline-block">
              {showDashboard
                ? Translator('DASHBOARD_BUTTON_HIDE')
                : Translator('DASHBOARD_BUTTON_SHOW')}
            </span>
          </Button>
        </div>
      </div>
      <DashboardReports isVisible={showDashboard} />
      <TableOrdersMenu />
      <TableOrderList />
    </>
  );
};

export default Main;
