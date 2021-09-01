import React, {createContext, useEffect, useState} from 'react';
// Multilanguage implementation
import i18n from 'i18next';
import {useTranslation, initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import HttpApi from 'i18next-http-backend';
import ClothingIconsList from '../clothinIcons';
import Utils from '../Utils';

export const OrderListContext = createContext();

const translationPath = Utils.GetBaseName('', '/melista');

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    detection: {
      order: ['navigator', 'cookie', 'localStorage', 'htmlTag', 'path'],
      caches: ['cookie'],
    },
    backend: {
      loadPath: `${translationPath}/assets/locales/{{lng}}/translation.json`,
    },
    react: {useSuspense: false},
  });

i18n.changeLanguage();

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
    {id: 1, name: 'tshirtCycling', size: '', quantity: 0},
    {id: 2, name: 'tshirtLong', size: '', quantity: 0},
    {id: 2, name: 'tshirtLongCycling', size: '', quantity: 0},
    {id: 3, name: 'shorts', size: '', quantity: 0},
    {id: 3, name: 'shortsCycling', size: '', quantity: 0},
    {id: 4, name: 'pants', size: '', quantity: 0},
    {id: 4, name: 'pantsCycling', size: '', quantity: 0},
    {id: 5, name: 'tanktop', size: '', quantity: 0},
    {id: 6, name: 'vest', size: '', quantity: 0},
  ],
};

const OrderListProvider = ({children}) => {
  const {t: Translator} = useTranslation();

  const updateLanguage = (countryCode) => {
    i18n.changeLanguage(countryCode);
  };

  const [isCycling, setIsCycling] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [settings, setSettings] = useState({
    coinPrefix: '$',
    maxQuantityPerClothe: 100,
  });

  const [clothingIcons] = useState({
    tshirt: {id: 1, icon: ClothingIconsList.tshirt, isCycling: false},

    tshirtCycling: {
      id: 1,
      icon: ClothingIconsList.tshirtCycling,
      isCycling: true,
    },

    tshirtLong: {id: 2, icon: ClothingIconsList.tshirtLong, isCycling: false},

    tshirtLongCycling: {
      id: 2,
      icon: ClothingIconsList.tshirtLongCycling,
      isCycling: true,
    },

    shorts: {id: 3, icon: ClothingIconsList.shorts, isCycling: false},

    shortsCycling: {
      id: 3,
      icon: ClothingIconsList.shortsCycling,
      isCycling: true,
    },

    pants: {id: 4, icon: ClothingIconsList.pants, isCycling: false},

    pantsCycling: {
      id: 4,
      icon: ClothingIconsList.pantsCycling,
      isCycling: true,
    },

    tanktop: {id: 5, icon: ClothingIconsList.tanktop},

    vest: {id: 6, icon: ClothingIconsList.vest},
  });

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

  const [currentClothingPrices, setCurrentClothingPrices] = useState(null);

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
        clothingSizes,
        orderItem.clothingSettings,
        orderItem.gender,
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
        clothingSizes,
        orderItem.clothingSettings,
        orderItem.gender,
      );
      return orderItem;
    });

    return totalToReceive;
  };

  // Control modal with list of clothes
  const [modalClothesOpened, setModalClothesOpened] = useState(false);

  // * * * * * * * * * * * * * * * * * * * * * * *
  // * * * * * * * LOAD SETTINGS * * * * * * * * *
  useEffect(() => {
    const currentLocalStorageData = localStorage.getItem('sisbot');
    const currentLocalStorageSettings = localStorage.getItem('sisbot.settings');
    const currentLocalStorageBussinessPrices = localStorage.getItem(
      'sisbot.bussiness.prices',
    );

    // LOAD ENVIROMENT SETTINGS
    if (currentLocalStorageSettings !== null) {
      const data = JSON.parse(currentLocalStorageSettings);
      setSettings(data);
    } else {
      // DEFAULT SETTINGS
      localStorage.setItem(
        'sisbot.settings',
        JSON.stringify({
          coinPrefix: '$',
          maxQuantityPerClothe: 100,
        }),
      );
    }

    if (currentLocalStorageBussinessPrices !== null) {
      const data = JSON.parse(currentLocalStorageBussinessPrices);
      setCurrentClothingPrices(data);
    }

    if (currentLocalStorageData !== null) {
      // console.log('RESTORING PREVIEWS SAVED DATA.');
      const data = JSON.parse(currentLocalStorageData);

      // RESTORE ORDER ITEMS LIST
      setOrderListItems(data.orderListItems);

      // RESTORE NOTES
      setOrderListItemsNotes(data.orderListItemsNotes);

      // RESTORE CYCLING FLAG
      setIsCycling(data.isCycling);
    } else {
      // console.log('INITIALIZE WITH DEFAULT EMPTY DATA.');
      localStorage.setItem(
        'sisbot',
        JSON.stringify({
          orderListItemsNotes,
          orderListItems: [],
        }),
      );
    }
  }, []);

  // UPDATE TABLE ROWS WHEN PRICE CHANGES
  useEffect(() => {
    // RECALCULATE EACH LINE
    const updatedTableRows = orderListItems.map((orderItem) => {
      // CALCULATE PAYMENT VALUE BASED IN BUSSINESS PRICES DATA
      const updatedPaymentValue = Utils.CalculatePaymentValueToOrderItem(
        currentClothingPrices,
        clothingSizes,
        orderItem.clothingSettings,
        orderItem.gender,
      );

      return {
        ...orderItem,
        payment: {
          ...orderItem.payment,
          value: updatedPaymentValue,
        },
      };
    });

    setOrderListItems(updatedTableRows);
  }, [currentClothingPrices]);

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

  // SAVE CYCLING FLAG
  useEffect(() => {
    const currentLocalStorage = JSON.parse(localStorage.getItem('sisbot'));

    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        ...currentLocalStorage,
        isCycling,
      }),
    );
  }, [isCycling]);

  // SAVE SETTINGS
  useEffect(() => {
    localStorage.setItem(
      'sisbot.settings',
      JSON.stringify({
        ...settings,
      }),
    );
  }, [settings]);

  useEffect(() => {
    // KEEP LOCALSTORAGE UPDATED
    const currentLocalStorage = JSON.parse(localStorage.getItem('sisbot'));

    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        ...currentLocalStorage,
        orderListItems,
      }),
    );

    // KEEP DASHBOARD UPDATED
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
    currentClothingPrices,
    setCurrentClothingPrices,
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
    isCycling,
    setIsCycling,
    isSettingsOpen,
    setSettingsOpen,
    settings,
    setSettings,
  };

  return (
    <OrderListContext.Provider value={ContextValues}>
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
