import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import Title from '../../components/Title';
import Separator from '../../components/Separator';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';

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
          <Button
            className="mr-2"
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

          <ButtonToggleClothignIcons />
        </div>
      </div>
      {showDashboard && (
        <>
          <DashboardReports />
          <TableOrdersMenu />
        </>
      )}
      <TableOrderList />
    </>
  );
};

export default Main;
