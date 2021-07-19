import React from 'react';
import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import Title from '../../components/Title';
import Separator from '../../components/Separator';
import TableOrderList from '../../components/TableOrderList';

const Main = () => (
  <>
    <FormAddOrderItem />
    <Separator />
    <Title text="Lista de Pedidos" />
    <DashboardReports />
    <TableOrdersMenu />
    <TableOrderList />
  </>
);

export default Main;
