import React from 'react';
import Container from 'react-bootstrap/Container';
import {ToastProvider} from 'react-toast-notifications';
import {Switch, Route, HashRouter} from 'react-router-dom';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'flag-icon-css/css/flag-icon.min.css';

import {NavbarContainer, MainContentContainer} from './styles';
import NavbarLeftContent from '../NavbarLeftContent';
import LanguageChanger from '../LanguageChanger';
import ModalChooseClothes from '../ModalChooseClothes';
import OrderListProvider from '../../contexts/OrderListContext';
import ReportProvider from '../../contexts/ReportContext';
import GlobalStyle from '../../globalStyle';

import Main from '../../Pages/Main';
import Report from '../../Pages/Report';
import BussinessPricing from '../../Pages/BussinessPricing';

import RedEyeOneFormes from '../RedEyeOneFormes';
import ModalSettings from '../ModalSettings';
import SettingsButtonNavbar from '../SettingsButtonNavbar';

const ReportWithContext = () => (
  <ReportProvider>
    <Report />
  </ReportProvider>
);

const App = () => (
  <OrderListProvider>
    <GlobalStyle />
    <ToastProvider>
      <ModalChooseClothes />
      <ModalSettings />
      <NavbarContainer>
        <NavbarLeftContent>
          <RedEyeOneFormes />
          <SettingsButtonNavbar />
          <LanguageChanger />
        </NavbarLeftContent>
      </NavbarContainer>
      <MainContentContainer>
        <Container>
          <HashRouter>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/report" component={ReportWithContext} />
              <Route path="/bussiness/pricing" component={BussinessPricing} />
            </Switch>
          </HashRouter>
        </Container>
      </MainContentContainer>
    </ToastProvider>
  </OrderListProvider>
);

export default App;
