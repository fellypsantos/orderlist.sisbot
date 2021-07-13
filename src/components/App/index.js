import React from 'react';
import Container from 'react-bootstrap/Container';
import {ToastProvider} from 'react-toast-notifications';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import {NavbarContainer, MainContentContainer} from './styles';
import NavbarLeftContent from '../NavbarLeftContent';
import LanguageChanger from '../LanguageChanger';
import TableOrdersMenu from '../TableOrdersMenu';
import FormAddOrderItem from '../FormAddOrderItem';
import DashboardReports from '../DashboardReports';
import Title from '../Title';
import Separator from '../Separator';
import TableOrderList from '../TableOrderList';
import ModalChooseClothes from '../ModalChooseClothes';
import OrderListProvider from '../../contexts/OrderListContext';
import GlobalStyle from '../../globalStyle';
import ModalChoosePrices from '../ModalChoosePrices';

export default function App() {
  return (
    <OrderListProvider>
      <GlobalStyle />
      <ToastProvider>
        <ModalChooseClothes />
        <ModalChoosePrices />

        <NavbarContainer className="bg-primary">
          <NavbarLeftContent>
            <LanguageChanger />
          </NavbarLeftContent>
        </NavbarContainer>

        <MainContentContainer>
          <Container>
            <FormAddOrderItem />
            <Separator />
            <Title text="Lista de Pedidos" />
            <DashboardReports />
            <TableOrdersMenu />
            <TableOrderList />
          </Container>
        </MainContentContainer>
      </ToastProvider>
    </OrderListProvider>
  );
}
