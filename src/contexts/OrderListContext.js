import React, {createContext, useState} from 'react';
// Multilanguage implementation
import i18n from 'i18next';
import {useTranslation, initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import ClothingIconsList from '../clothinIcons';

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
  clothingSettings: [
    {id: 1, name: 'tshirt', size: '', quantity: 0},
    {id: 2, name: 'tshirtLong', size: '', quantity: 0},
    {id: 3, name: 'shorts', size: '', quantity: 0},
    {id: 4, name: 'pants', size: '', quantity: 0},
    {id: 5, name: 'tanktop', size: '', quantity: 0},
    {id: 6, name: 'vest', size: '', quantity: 0},
  ],
};

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
  const [tempOrderItem, setTempOrderItem] = useState(initialTempOrderItem);

  // Control modal with list of clothes
  const [modalClothesOpened, setModalClothesOpened] = useState(false);

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
  };

  return (
    <OrderListContext.Provider value={ContextValues}>
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
