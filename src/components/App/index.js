import React from 'react';
import Container from 'react-bootstrap/Container';
import {ToastProvider} from 'react-toast-notifications';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import {NavbarContainer, MainContentContainer} from './styles';
import NavbarLeftContent from '../NavbarLeftContent';
import LanguageChanger from '../LanguageChanger';
import ModalChooseClothes from '../ModalChooseClothes';
import OrderListProvider from '../../contexts/OrderListContext';
import GlobalStyle from '../../globalStyle';
import ModalChoosePrices from '../ModalChoosePrices';

import Main from '../../Pages/Main';
import Report from '../../Pages/Report';
import BussinessPricing from '../../Pages/BussinessPricing';

import RedEyeOneFormes from '../RedEyeOneFormes';

const App = () => (
  <OrderListProvider>
    <GlobalStyle />
    <ToastProvider>
      <ModalChooseClothes />
      <ModalChoosePrices />

      <NavbarContainer className="bg-primary">
        <NavbarLeftContent>
          <RedEyeOneFormes />
          <LanguageChanger />
        </NavbarLeftContent>
      </NavbarContainer>

      <MainContentContainer>
        <Container>
          <BrowserRouter basename="/melista">
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/report" component={Report} />
              <Route path="/bussiness/pricing" component={BussinessPricing} />
            </Switch>
          </BrowserRouter>
        </Container>
      </MainContentContainer>
    </ToastProvider>
  </OrderListProvider>
);

export default App;
