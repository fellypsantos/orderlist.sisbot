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
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
    react: {useSuspense: false},
  });

i18n.changeLanguage();

const initialTempOrderItem = {
  name: '',
  number: '',
  payment: {
    paid: false,
    value: 0,
  },
  clothingSettings: [
    {id: 1, name: 'tshirt', size: '', gender: '', quantity: 0},
    {id: 1, name: 'tshirtCycling', size: '', gender: '', quantity: 0},
    {id: 2, name: 'tshirtLong', size: '', gender: '', quantity: 0},
    {id: 2, name: 'tshirtLongCycling', size: '', gender: '', quantity: 0},
    {id: 3, name: 'shorts', size: '', gender: '', quantity: 0},
    {id: 3, name: 'shortsCycling', size: '', gender: '', quantity: 0},
    {id: 4, name: 'pants', size: '', gender: '', quantity: 0},
    {id: 4, name: 'pantsCycling', size: '', gender: '', quantity: 0},
    {id: 5, name: 'tanktop', size: '', gender: '', quantity: 0},
    {id: 6, name: 'vest', size: '', gender: '', quantity: 0},
    {id: 7, name: 'socks', size: '', gender: '', quantity: 0},
  ],
};

const OrderListProvider = ({children}) => {
  const {t: Translator} = useTranslation();

  const [isCycling, setIsCycling] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const [settings, setSettings] = useState({
    coinPrefix: '$',
    maxQuantityPerClothe: 100,
    filterEnabled: false,
    isDashboardVisible: false,
    uuidFromLoadedPriceTable: '',
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
    socks: {id: 7, icon: ClothingIconsList.socks},
  });

  const [clothingSizes] = useState([
    {id: 1, priceIndex: 0, value: 'T-PP', gender: 'MALE', color: '#c6dbff'},
    {id: 2, priceIndex: 1, value: 'T-P', gender: 'MALE', color: '#c6dbff'},
    {id: 3, priceIndex: 2, value: 'T-M', gender: 'MALE', color: '#c6dbff'},
    {id: 4, priceIndex: 3, value: 'T-G', gender: 'MALE', color: '#c6dbff'},
    {id: 5, priceIndex: 4, value: 'T-GG', gender: 'MALE', color: '#c6dbff'},
    {id: 6, priceIndex: 5, value: 'T-XG', gender: 'MALE', color: '#c6dbff'},
    {id: 7, priceIndex: 6, value: 'T-2XG', gender: 'MALE', color: '#c6dbff'},
    {id: 8, priceIndex: 7, value: 'T-3XG', gender: 'MALE', color: '#c6dbff'},
    {id: 9, priceIndex: 8, value: 'T-4XG', gender: 'MALE', color: '#c6dbff'},

    {id: 10, priceIndex: 0, value: 'T-PP', gender: 'FEMALE', color: '#fdd6ff'},
    {id: 11, priceIndex: 1, value: 'T-P', gender: 'FEMALE', color: '#fdd6ff'},
    {id: 12, priceIndex: 2, value: 'T-M', gender: 'FEMALE', color: '#fdd6ff'},
    {id: 13, priceIndex: 3, value: 'T-G', gender: 'FEMALE', color: '#fdd6ff'},
    {
      id: 14,
      priceIndex: 4,
      value: 'T-GG',
      gender: 'FEMALE',
      color: '#fdd6ff',
    },
    {
      id: 15,
      priceIndex: 5,
      value: 'T-XG',
      gender: 'FEMALE',
      color: '#fdd6ff',
    },
    {
      id: 16,
      priceIndex: 6,
      value: 'T-2XG',
      gender: 'FEMALE',
      color: '#fdd6ff',
    },
    {
      id: 17,
      priceIndex: 7,
      value: 'T-3XG',
      gender: 'FEMALE',
      color: '#fdd6ff',
    },
    {
      id: 18,
      priceIndex: 8,
      value: 'T-4XG',
      gender: 'FEMALE',
      color: '#fdd6ff',
    },

    {
      id: 19,
      priceIndex: 0,
      value: 'T-2A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 20,
      priceIndex: 1,
      value: 'T-4A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 21,
      priceIndex: 2,
      value: 'T-6A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 22,
      priceIndex: 3,
      value: 'T-8A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 23,
      priceIndex: 4,
      value: 'T-10A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 24,
      priceIndex: 5,
      value: 'T-12A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 25,
      priceIndex: 6,
      value: 'T-14A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
    {
      id: 26,
      priceIndex: 7,
      value: 'T-16A',
      gender: 'CHILDISH',
      color: '#d3ffdf',
    },
  ]);

  const [clothingSizesDropDown, setClothingSizesDropDown] = useState([]);

  const [initialStateTempOrderItem] = useState(initialTempOrderItem);

  const [currentClothingPrices, setCurrentClothingPrices] = useState(null);

  const [screenshotMode, setScreenshotMode] = useState(false);

  const [shouldFilter, setShouldFilter] = useState(false);

  const [tempOrderItem, setTempOrderItem] = useState(initialTempOrderItem);

  const [orderListItems, setOrderListItems] = useState([]);

  const [paidOrderItems, setPaidOrderItems] = useState([]);

  const [listName, setListName] = useState('');

  const [companyName, setCompanyName] = useState('');

  const [companyEmail, setCompanyEmail] = useState('');

  const [orderListItemsNotes, setOrderListItemsNotes] = useState('');

  const [orderListClientNotes, setOrderListClientNotes] = useState('');

  const [lastChangeI18Next, setLastChangeI18Next] = useState(null);

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

  const [showDashboard, setShowDashboard] = useState(false);
  const [showBudget, setShowBudget] = useState(true);

  // * * * * * * * * * * * * * * * *
  // CONTROL PRICES FOR EACH GENDER
  // * * * * * * * * * * * * * * * *
  const [projectName] = useState('');

  const [priceTableMale] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    socks: [0],
  });

  const [priceTableFemale] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    socks: [0],
  });

  const [priceTableChildish] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    socks: [0],
  });

  const [priceTableUnique] = useState({
    socks: [0],
  });

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
      );
      return orderItem;
    });

    return totalToReceive;
  };

  // Control modal with list of clothes
  const [modalClothesOpened, setModalClothesOpened] = useState(false);
  const [modalSequencialListOpen, setModalSequencialListOpen] = useState(false);
  const [modalDeleteSelectedOpen, setModalDeleteSelectedOpen] = useState(false);

  const updateLanguage = (countryCode) => {
    i18n.changeLanguage(countryCode);
    setLastChangeI18Next(new Date());
  };

  const loadMainSettings = (data = null) => {
    if (data !== null) {
      // RESTORE LIST NAME
      setListName(data.listName);
      console.log('✅ Loaded list name.');

      // RESTORE ORDER ITEMS LIST
      setOrderListItems(data.orderListItems);
      console.log('✅ Loaded order list.');

      // RESTORE NOTES
      setOrderListItemsNotes(data.orderListItemsNotes);
      console.log('✅ Loaded order list company notes.');

      // RESTORE CLIENT NOTES
      setOrderListClientNotes(data.orderListClientNotes);
      console.log('✅ Loaded order list client notes.');

      // RESTORE CYCLING FLAG
      setIsCycling(data.isCycling);
      console.log('✅ Loaded cycling flag.');
    } else {
      console.log('💙 Main informations set to default.');
      localStorage.setItem(
        'sisbot',
        JSON.stringify({
          listName: '',
          orderListItemsNotes,
          orderListClientNotes,
          orderListItems: [],
          isCycling: false,
        }),
      );
    }
  };

  // * * * * * * * * * * * * * * * * * * * * * * *
  // * * * * * * * LOAD SETTINGS * * * * * * * * *
  // * * * * * * * * * * * * * * * * * * * * * * *
  useEffect(() => {
    console.log('🔥 LOADING SETTINGS 🔥');

    const clsData = localStorage.getItem('sisbot');
    const clsSettings = localStorage.getItem('sisbot.settings');
    const clsBussinessPrices = localStorage.getItem('sisbot.bussiness.prices');
    const clsCompanyInformation = localStorage.getItem(
      'sisbot.bussiness.company',
    );

    // LOAD ENVIROMENT SETTINGS
    if (clsSettings !== null) {
      const data = JSON.parse(clsSettings);
      setSettings(data);
      setShouldFilter(data.filterEnabled);
      setShowDashboard(data.isDashboardVisible);
      console.log('✅ Loaded price settings.');
    } else {
      // DEFAULT SETTINGS
      localStorage.setItem(
        'sisbot.settings',
        JSON.stringify({
          coinPrefix: '$',
          maxQuantityPerClothe: 100,
          filterEnabled: false,
          isDashboardVisible: false,
          uuidFromLoadedPriceTable: '',
        }),
      );
    }

    if (clsBussinessPrices !== null) {
      // ALREADY EXISTS DATA
      const data = JSON.parse(clsBussinessPrices);
      setCurrentClothingPrices(data);
    } else {
      // DEFAULT DATA
      const defaultData = {
        projectName: projectName,
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
        priceTableUnique,
      };

      // SET LOCALSTORAGE
      localStorage.setItem(
        'sisbot.bussiness.prices',
        JSON.stringify(defaultData),
      );

      // SET STATE
      setCurrentClothingPrices(defaultData);
      console.log('💙 Pricing tables set to default.');
    }

    // LOAD COMPANY DATA
    if (clsCompanyInformation !== null) {
      // LOAD ME
      const data = JSON.parse(clsCompanyInformation);
      setCompanyName(data.companyName);
      setCompanyEmail(data.companyEmail);
    } else {
      // SET DEFAULT (FIRST LOAD)
      const defaultData = {
        companyName,
        companyEmail,
      };

      localStorage.setItem(
        'sisbot.bussiness.company',
        JSON.stringify(defaultData),
      );
    }

    // LOAD LIST DATA AND NOTES
    if (clsData !== null) {
      const data = JSON.parse(clsData);
      loadMainSettings(data); // RESTORE
    } else {
      loadMainSettings(); // SET DEFAULT
    }

    setLastChangeI18Next(new Date());
  }, []);

  // * * * * * * * * * * * * * * * * * * * * * * *
  // * * * * * * * orderListItems * * * * * * * *
  // * * * * * * * * * * * * * * * * * * * * * * *
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

    // COLLECT SELECTED ROWS TO FURTHER DELETION
    const selectedRowsID = [];
    orderListItems.forEach((orderItem) => {
      if (orderItem.payment.paid) selectedRowsID.push(orderItem.id);
    });

    setPaidOrderItems(selectedRowsID);
  }, [orderListItems]);

  // SAVE LIST NAME / ORDER LIST NOTES / CYCLING FLAG
  useEffect(() => {
    localStorage.setItem(
      'sisbot',
      JSON.stringify({
        listName,
        orderListItems,
        orderListItemsNotes,
        orderListClientNotes,
        isCycling,
      }),
    );
  }, [listName, orderListItemsNotes, orderListClientNotes, isCycling]);

  useEffect(() => {
    if (orderListItems.length === 0) return false;

    const convertionType = isCycling ? 'CYCLING' : 'NORMAL';
    console.log('✔ CONVERTING ALL CLOTHES TO : ', convertionType);

    const convertedOrderList = orderListItems.map((orderItem) => {
      const theClothes = orderItem.clothingSettings;

      const convertedClothingSettings = theClothes.map((clotheItem) => {
        // 🔁 CONVERT TO CYCLING
        if (isCycling && !clotheItem.name.toLowerCase().includes('cycling')) {
          if (clotheItem.id >= 1 && clotheItem.id <= 4) {
            return {
              ...clotheItem,
              name: `${clotheItem.name}Cycling`,
            };
          }
        }

        // 🔁 CONVERT TO NORMAL
        if (!isCycling && clotheItem.name.toLowerCase().includes('cycling')) {
          if (clotheItem.id >= 1 && clotheItem.id <= 4) {
            return {
              ...clotheItem,
              name: clotheItem.name.replace('Cycling', ''),
            };
          }
        }
        return clotheItem;
      });

      return {
        ...orderItem,
        clothingSettings: convertedClothingSettings,
      };
    });

    setOrderListItems(convertedOrderList);
    console.log('❤ ', orderListItems);
    console.log('❤ FINISHED');
  }, [isCycling]);

  // UPDATE TABLE ROWS WHEN PRICE CHANGES
  useEffect(() => {
    if (orderListItems.length === 0) return;

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

  // SAVE SETTINGS
  useEffect(() => {
    localStorage.setItem(
      'sisbot.settings',
      JSON.stringify({
        ...settings,
        filterEnabled: shouldFilter,
        isDashboardVisible: showDashboard,
      }),
    );
  }, [settings, shouldFilter, showDashboard]);

  useEffect(() => {
    localStorage.setItem(
      'sisbot.bussiness.company',
      JSON.stringify({
        companyName,
        companyEmail,
      }),
    );
  }, [companyName]);

  useEffect(() => {
    if (currentClothingPrices === null) return false; // PREVENT ERROR
    // RUN FILTER WITH SETTINGS WINDOW IS CLOSING
    if (!modalClothesOpened && isSettingsOpen) return false;

    const defaultArraySample = [
      {
        label: Translator('MALE'),
        options: [],
      },
      {
        label: Translator('FEMALE'),
        options: [],
      },
      {
        label: Translator('CHILDISH'),
        options: [],
      },
    ];

    /**
     *  GENERATE NO FILTERED DATA
     */
    if (!shouldFilter) {
      console.warn('🔶 LISTA NÃO SERÁ FILTRADA');

      const maleSizes = [];
      const femaleSizes = [];
      const childSizes = [];

      clothingSizes.forEach((item) => {
        const addItem = {...item, label: Translator(item.value)};

        if (item.gender === 'MALE') maleSizes.push(addItem);
        if (item.gender === 'FEMALE') femaleSizes.push(addItem);
        if (item.gender === 'CHILDISH') childSizes.push(addItem);

        const groupedDropDown = [
          {
            label: Translator('MALE'),
            options: maleSizes,
          },
          {
            label: Translator('FEMALE'),
            options: femaleSizes,
          },
          {
            label: Translator('CHILDISH'),
            options: childSizes,
          },
        ];
        setClothingSizesDropDown(groupedDropDown);
      });
    } else {
      console.warn('✅ FILTRO DE LISTA ATIVADO');
      /** MAIN LIST THAT HOLDS FILTERED */
      const dbGroupedDropDown = {
        tshirt: JSON.parse(JSON.stringify(defaultArraySample)),
        tshirtLong: JSON.parse(JSON.stringify(defaultArraySample)),
        shorts: JSON.parse(JSON.stringify(defaultArraySample)),
        pants: JSON.parse(JSON.stringify(defaultArraySample)),
        tanktop: JSON.parse(JSON.stringify(defaultArraySample)),
        vest: JSON.parse(JSON.stringify(defaultArraySample)),
        socks: JSON.parse(JSON.stringify(defaultArraySample)),
      };

      // LOOP THROUGH EACH CLOTHE
      Utils.FilterClothesByMode(clothingIcons, isCycling).map((theClothe) => {
        const safeClotheName = theClothe.replace('Cycling', '');

        // LOOP THROUGH ALL SIZES TO THIS CLOTHE
        clothingSizes.forEach((theSize) => {
          /* * * * * * * * * * * * * * * * * * * * *
           * GENERATE OPTIONS FOR MALE
           * * * * * * * * * * * * * * * * * * * * */
          if (theSize.gender === 'MALE') {
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableMale;

            const currentPrice =
              targetPrices[safeClotheName][theSize.priceIndex];

            const newOption = {
              ...theSize,
              label: Translator(theSize.value),
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[safeClotheName][targetIndex].options.push(
                newOption,
              );
            }
          } else if (theSize.gender === 'FEMALE') {
            /* * * * * * * * * * * * * * * * * * * * *
             * GENERATE OPTIONS FOR FEMALE
             * * * * * * * * * * * * * * * * * * * * */
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableFemale;
            const currentPrice =
              targetPrices[safeClotheName][theSize.priceIndex];
            const newOption = {
              ...theSize,
              label: Translator(theSize.value),
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[safeClotheName][targetIndex].options.push(
                newOption,
              );
            }
          } else if (theSize.gender === 'CHILDISH') {
            /* * * * * * * * * * * * * * * * * * * * *
             * GENERATE OPTIONS FOR CHILDISH
             * * * * * * * * * * * * * * * * * * * * */
            const targetIndex = Utils.ParseGenderToIndex(theSize.gender);
            const targetPrices = currentClothingPrices.priceTableChildish;
            const currentPrice =
              targetPrices[safeClotheName][theSize.priceIndex];
            const newOption = {
              ...theSize,
              label: Translator(theSize.value),
            };

            // NOW SAVE IT TO MAIN LIST
            if (currentPrice > 0) {
              dbGroupedDropDown[safeClotheName][targetIndex].options.push(
                newOption,
              );
            }
          }
        });
      });

      // FILTERED DATA
      setClothingSizesDropDown(dbGroupedDropDown);
    }
  }, [Translator, modalClothesOpened, isSettingsOpen]);

  const ContextValues = {
    Translator,
    updateLanguage,
    clothingIcons,
    clothingSizes,
    clothingSizesDropDown,
    setClothingSizesDropDown,
    modalClothesOpened,
    setModalClothesOpened,
    modalSequencialListOpen,
    setModalSequencialListOpen,
    modalDeleteSelectedOpen,
    setModalDeleteSelectedOpen,
    initialStateTempOrderItem,
    tempOrderItem,
    setTempOrderItem,
    orderListItems,
    setOrderListItems,
    paidOrderItems,
    setPaidOrderItems,
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
    orderListClientNotes,
    setOrderListClientNotes,
    showDashboard,
    setShowDashboard,
    showBudget,
    setShowBudget,
    isCycling,
    setIsCycling,
    isSettingsOpen,
    setSettingsOpen,
    settings,
    setSettings,
    lastChangeI18Next,
    setLastChangeI18Next,
    shouldFilter,
    setShouldFilter,
    listName,
    setListName,
    companyName,
    setCompanyName,
    companyEmail,
    setCompanyEmail,
  };

  return (
    <OrderListContext.Provider value={ContextValues}>
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
