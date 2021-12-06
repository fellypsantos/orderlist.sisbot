import React, {useContext, useState, useEffect} from 'react';
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
  const {updateLanguage, Translator, lastChangeI18Next} = useContext(
    OrderListContext,
  );
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleOnBlurDropdown = async () => {
    await Utils.Sleep(150);
    setDropdownVisible(false);
  };

  useEffect(() => {
    // LOAD TRANSLATION DATA FOR KANBAN
    if (Translator('TITLE') === 'TITLE') return false;

    const kanbanTranslation = {
      title: Translator('TITLE'),
      description: Translator('DESCRIPTION'),
      editLabels: Translator('EDIT_LABELS'),
      label: Translator('LABEL'),
      labels: Translator('LABELS'),
      addButton: Translator('ADD'),
      deleteAllButton: Translator('CLEAR'),
      saveChangesButton: Translator('SAVE_CHANGES'),
      closeButton: Translator('CLOSE'),
      darkLightButton: Translator('DARK_LIGHT'),
    };

    // SAVE TO LOCALSTORAGE
    localStorage.setItem(
      'kanban.translation',
      JSON.stringify(kanbanTranslation),
    );
  }, [updateLanguage, lastChangeI18Next]);

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
