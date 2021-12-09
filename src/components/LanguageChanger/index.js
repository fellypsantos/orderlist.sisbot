import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobeAmericas} from '@fortawesome/free-solid-svg-icons';
import {
  DropdownContainer,
  DropdownContent,
  DropdownContentItem,
} from './styles';
import Utils from '../../Utils';
import {OrderListContext} from '../../contexts/OrderListContext';

import flagBR from '../../images/icons/flag-br.svg';
import flagUS from '../../images/icons/flag-us.svg';
import flagES from '../../images/icons/flag-es.svg';

const flagList = {
  br: flagBR,
  us: flagUS,
  es: flagES,
};

const systemLanguages = [
  {id: 1, code: 'pt', countryIconID: 'br', title: 'Português'},
  {id: 2, code: 'en', countryIconID: 'us', title: 'English'},
  {id: 3, code: 'es', countryIconID: 'es', title: 'Spañol'},
];

export default function LanguageChanger() {
  const {updateLanguage, Translator} = useContext(OrderListContext);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOnBlurDropdown = async () => {
    await Utils.Sleep(150);
    setDropdownVisible(false);
  };

  return (
    <>
      <DropdownContainer isOpen={dropdownVisible}>
        <Button
          variant="light"
          title="Selecione o idioma do sistema."
          onClick={() => setDropdownVisible(!dropdownVisible)}
          onBlur={handleOnBlurDropdown}>
          <FontAwesomeIcon
            icon={faGlobeAmericas}
            style={{marginRight: '5px'}}
          />
          <span id="language-dropdown-label">{Translator('LANGUAGE')}</span>
        </Button>

        <DropdownContent visible={dropdownVisible}>
          {systemLanguages.map((language) => (
            <DropdownContentItem
              key={language.id}
              onClick={() => updateLanguage(language.code)}>
              <img
                src={flagList[language.countryIconID]}
                alt="flag"
                width={25}
                style={{marginRight: 5}}
              />
              <span>{language.title}</span>
            </DropdownContentItem>
          ))}
        </DropdownContent>
      </DropdownContainer>
    </>
  );
}
