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
              <span
                className={`flag-icon flag-icon-${language.countryIconID}`}
              />
              <span>{language.title}</span>
            </DropdownContentItem>
          ))}
        </DropdownContent>
      </DropdownContainer>
    </>
  );
}
