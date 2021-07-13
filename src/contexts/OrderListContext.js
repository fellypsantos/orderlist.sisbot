import React, {createContext, useEffect, useState} from 'react';
// Multilanguage implementation
import i18n from 'i18next';
import {useTranslation, initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ClothingIconsList from '../clothinIcons';
import Utils from '../Utils';

export const OrderListContext = createContext();

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng: 'pt',
    detection: {
      order: ['cookie', 'localStorage', 'htmlTag', 'path'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: {useSuspense: false},
  });

const initialTempOrderItem = {
  name: '',
  number: '',
  gender: 'MALE',
  payment: {
    paid: false,
    value: 0,
  },
  clothingSettings: [
    {id: 1, name: 'tshirt', size: '', quantity: 0},
    {id: 2, name: 'tshirtLong', size: '', quantity: 0},
    {id: 3, name: 'shorts', size: '', quantity: 0},
    {id: 4, name: 'pants', size: '', quantity: 0},
    {id: 5, name: 'tanktop', size: '', quantity: 0},
    {id: 6, name: 'vest', size: '', quantity: 0},
  ],
};

const initialClothingPrices = [
  {id: 1, icon: ClothingIconsList.tshirt, price: ''},
  {id: 2, icon: ClothingIconsList.tshirtLong, price: ''},
  {id: 3, icon: ClothingIconsList.shorts, price: ''},
  {id: 4, icon: ClothingIconsList.pants, price: ''},
  {id: 5, icon: ClothingIconsList.tanktop, price: ''},
  {id: 6, icon: ClothingIconsList.vest, price: ''},
];

const OrderListProvider = ({children}) => {
  const {t: Translator} = useTranslation();

  const updateLanguage = (countryCode) => {
    i18n.changeLanguage(countryCode);
    console.log('New language is: ', countryCode);
  };

  const [clothingIcons] = useState([
    {id: 1, icon: ClothingIconsList.tshirt},
    {id: 2, icon: ClothingIconsList.tshirtLong},
    {id: 3, icon: ClothingIconsList.shorts},
    {id: 4, icon: ClothingIconsList.pants},
    {id: 5, icon: ClothingIconsList.tanktop},
    {id: 6, icon: ClothingIconsList.vest},
  ]);

  const [clothingSizes] = useState([
    {id: 1, code: 'T-PP'},
    {id: 2, code: 'T-P'},
    {id: 3, code: 'T-M'},
    {id: 4, code: 'T-G'},
    {id: 5, code: 'T-GG'},
    {id: 6, code: 'T-2XG'},
    {id: 7, code: 'T-3XG'},
    {id: 8, code: 'T-4XG'},
  ]);

  const [genderOptions] = useState([
    {id: 1, code: 'MALE'},
    {id: 2, code: 'FEMALE'},
    {id: 3, code: 'CHILDISH'},
  ]);

  const [initialStateTempOrderItem] = useState(initialTempOrderItem);
  const [initialStateClothingPrices] = useState(initialClothingPrices);

  const [currentClothingPrices, setCurrentClothingPrices] = useState(
    initialClothingPrices,
  );

  const [tempOrderItem, setTempOrderItem] = useState(initialTempOrderItem);

  const [orderListItems, setOrderListItems] = useState([]);

  const [dashboardData, setDashboardData] = useState({
    totalToReceive: 0,
    totalReceived: 0,
    needReceive: 0,
    totalProgressAsPercentage: 0,
  });

  // HELPER FUNCTIONS TO UPDATE DASHBOARD
  const calculateTotalToReceive = () => {
    let totalPaymentValue = 0;

    orderListItems.map((orderItem) => {
      // CALCULATE
      totalPaymentValue += Utils.CalculatePaymentValueToOrderItem(
        currentClothingPrices,
        orderItem.clothingSettings,
      );
      return orderItem;
    });

    return totalPaymentValue;
  };

  const calculateTotalReceived = () => {
    let totalToReceive = 0;

    // FILTER ONLY PAID STATUS
    const paidOrderItem = orderListItems.filter(
      (orderItem) => orderItem.payment.paid,
    );

    paidOrderItem.map((orderItem) => {
      totalToReceive += Utils.CalculatePaymentValueToOrderItem(
        currentClothingPrices,
        orderItem.clothingSettings,
      );
      return orderItem;
    });

    return totalToReceive;
  };

  // Control modal with list of clothes
  const [modalClothesOpened, setModalClothesOpened] = useState(false);

  // Control modal with prices
  const [modalPricesOpened, setModalPricesOpened] = useState(false);

  // LOAD SETTINGS
  useEffect(() => {
    console.log('LOAD SETTINGS');
    const currentLocalStorageData = localStorage.getItem('sisbot');

    // FIRST RUN, NO LOCALSTORAGE DATA
    if (currentLocalStorageData !== null) {
      console.log('RESTORING PREVIEWS SAVED DATA.');
      const data = JSON.parse(currentLocalStorageData);

      // RESTORE ORDER ITEMS LIST
      setOrderListItems(data.orderListItems);

      // RESTORE PRICES LIST
      setCurrentClothingPrices(data.pricesList);
    } else {
      console.log('INITIALIZE WITH DEFAULT EMPTY DATA.');
      localStorage.setItem(
        'sisbot',
        JSON.stringify({
          orderListItems: [],
          pricesList: {},
        }),
      );
    }
  }, []);

  // SAVE ORDER LIST
  useEffect(() => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('sisbot'));

    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        ...currentLocalStorage,
        orderListItems,
      }),
    );

    console.log('[UPDATED] LocalStorage: orderListitems.');
  }, [orderListItems]);

  // SAVE PRICES
  useEffect(() => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('sisbot'));

    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        ...currentLocalStorage,
        pricesList: currentClothingPrices,
      }),
    );

    console.log('[UPDATED] LocalStorage: pricesList.');
  }, [currentClothingPrices]);

  // KEEP DASHBOARD UPDATED
  useEffect(() => {
    console.log('UPDATE DASHBOARD');

    const totalToReceive = calculateTotalToReceive();
    const totalReceived = calculateTotalReceived();
    const needReceive = totalToReceive - totalReceived;
    const totalProgressAsPercentage = (totalReceived / totalToReceive) * 100;

    const fixedTotalToReceive = Number.isNaN(totalToReceive)
      ? 0
      : totalToReceive;

    const fixedTotalReceived = Number.isNaN(totalReceived) ? 0 : totalReceived;

    const fixedNeedReceive = Number.isNaN(needReceive) ? 0 : needReceive;

    const fixedTotalProgressAsPercentage = Number.isNaN(
      totalProgressAsPercentage,
    )
      ? 0
      : totalProgressAsPercentage.toFixed();

    setDashboardData({
      totalToReceive: fixedTotalToReceive,
      totalReceived: fixedTotalReceived,
      needReceive: fixedNeedReceive,
      totalProgressAsPercentage: fixedTotalProgressAsPercentage,
    });
  }, [orderListItems]);

  const ContextValues = {
    Translator,
    updateLanguage,
    clothingIcons,
    clothingSizes,
    genderOptions,
    modalClothesOpened,
    setModalClothesOpened,
    initialStateTempOrderItem,
    tempOrderItem,
    setTempOrderItem,
    orderListItems,
    setOrderListItems,
    initialStateClothingPrices,
    currentClothingPrices,
    setCurrentClothingPrices,
    modalPricesOpened,
    setModalPricesOpened,
    dashboardData,
    setDashboardData,
  };

  return (
    <OrderListContext.Provider value={ContextValues}>
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
