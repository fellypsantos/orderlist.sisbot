import React, {useContext} from 'react';
import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import Title from '../../components/Title';
import Separator from '../../components/Separator';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';

const Main = () => {
  const {Translator} = useContext(OrderListContext);

  return (
    <>
      <FormAddOrderItem />
      <Separator />
      <Title text={Translator('MAIN_TITLE')} />
      <DashboardReports />
      <TableOrdersMenu />
      <TableOrderList />
    </>
  );
};

export default Main;
