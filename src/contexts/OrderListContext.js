import React, {createContext, useEffect, useState} from 'react';
// Multilanguage implementation
import i18n from 'i18next';
import {useTranslation, initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ClothingIconsList from '../clothinIcons';
import Utils from '../Utils';

export const OrderListContext = createContext();

const translationPath =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? ''
    : '/melista';

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
      loadPath: `${translationPath}/assets/locales/{{lng}}/translation.json`,
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
  };

  const [clothingIcons] = useState([
    {id: 1, icon: ClothingIconsList.tshirt, name: 'tshirt'},
    {id: 2, icon: ClothingIconsList.tshirtLong, name: 'tshirtLong'},
    {id: 3, icon: ClothingIconsList.shorts, name: 'shorts'},
    {id: 4, icon: ClothingIconsList.pants, name: 'pants'},
    {id: 5, icon: ClothingIconsList.tanktop, name: 'tanktop'},
    {id: 6, icon: ClothingIconsList.vest, name: 'vest'},
  ]);

  const [clothingSizes] = useState([
    {id: 1, code: 'T-PP', target: 'ADULT'},
    {id: 2, code: 'T-P', target: 'ADULT'},
    {id: 3, code: 'T-M', target: 'ADULT'},
    {id: 4, code: 'T-G', target: 'ADULT'},
    {id: 5, code: 'T-GG', target: 'ADULT'},
    {id: 6, code: 'T-XG', target: 'ADULT'},
    {id: 7, code: 'T-2XG', target: 'ADULT'},
    {id: 8, code: 'T-3XG', target: 'ADULT'},
    {id: 9, code: 'T-4XG', target: 'ADULT'},
    {id: 10, code: 'T-2A', target: 'TEEN'},
    {id: 11, code: 'T-4A', target: 'TEEN'},
    {id: 12, code: 'T-6A', target: 'TEEN'},
    {id: 13, code: 'T-8A', target: 'TEEN'},
    {id: 14, code: 'T-10A', target: 'TEEN'},
    {id: 15, code: 'T-12A', target: 'TEEN'},
    {id: 16, code: 'T-14A', target: 'TEEN'},
    {id: 17, code: 'T-16A', target: 'TEEN'},
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

  const [screenshotMode, setScreenshotMode] = useState(false);

  const [tempOrderItem, setTempOrderItem] = useState(initialTempOrderItem);

  const [orderListItems, setOrderListItems] = useState([]);

  const [orderListItemsNotes, setOrderListItemsNotes] = useState('');

  const [editMode, setEditMode] = useState({
    enabled: false,
    orderItem: null,
  });

  const [dashboardData, setDashboardData] = useState({
    totalToReceive: 0,
    totalReceived: 0,
    needReceive: 0,
    totalProgressAsPercentage: 0,
  });

  const [showDashboard, setShowDashboard] = useState(true);

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
    // console.log('LOAD SETTINGS');
    const currentLocalStorageData = localStorage.getItem('sisbot');

    // FIRST RUN, NO LOCALSTORAGE DATA
    if (currentLocalStorageData !== null) {
      // console.log('RESTORING PREVIEWS SAVED DATA.');
      const data = JSON.parse(currentLocalStorageData);

      // RESTORE ORDER ITEMS LIST
      setOrderListItems(data.orderListItems);

      // RESTORE PRICES LIST
      setCurrentClothingPrices(data.pricesList);

      // RESTORE NOTES
      setOrderListItemsNotes(data.orderListItemsNotes);
    } else {
      // console.log('INITIALIZE WITH DEFAULT EMPTY DATA.');
      localStorage.setItem(
        'sisbot',
        JSON.stringify({
          orderListItemsNotes,
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

    // console.log('[UPDATED] LocalStorage: orderListitems.');
  }, [orderListItems]);

  // SAVE ORDER LIST NOTES
  useEffect(() => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('sisbot'));

    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        ...currentLocalStorage,
        orderListItemsNotes,
      }),
    );

    // console.log('[UPDATED] LocalStorage: orderListItemsNotes.');
  }, [orderListItemsNotes]);

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

    // console.log('[UPDATED] LocalStorage: pricesList.');
  }, [currentClothingPrices]);

  // KEEP DASHBOARD UPDATED
  useEffect(() => {
    // console.log('UPDATE DASHBOARD');

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
    screenshotMode,
    setScreenshotMode,
    editMode,
    setEditMode,
    orderListItemsNotes,
    setOrderListItemsNotes,
    showDashboard,
    setShowDashboard,
  };

  return (
    <OrderListContext.Provider value={ContextValues}>
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
