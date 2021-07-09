import React, {useState} from 'react';
import Button from 'react-bootstrap/Button';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobeAmericas} from '@fortawesome/free-solid-svg-icons';
import {
  DropdownContainer,
  DropdownContent,
  DropdownContentItem,
} from './styles';

export default function LanguageChanger() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  return (
    <>
      <DropdownContainer>
        <Button
          title="Selecione o idioma do sistema."
          onClick={() => setDropdownVisible(!dropdownVisible)}
          onBlur={() => setDropdownVisible(false)}>
          <FontAwesomeIcon
            icon={faGlobeAmericas}
            style={{marginRight: '5px'}}
          />
          <span>Idioma</span>
        </Button>

        <DropdownContent visible={dropdownVisible}>
          <DropdownContentItem>
            <span className="flag-icon flag-icon-br" />
            <span>Português</span>
          </DropdownContentItem>

          <DropdownContentItem>
            <span className="flag-icon flag-icon-us" />
            <span>English</span>
          </DropdownContentItem>

          <DropdownContentItem>
            <span className="flag-icon flag-icon-es" />
            <span>Spañol</span>
          </DropdownContentItem>
        </DropdownContent>
      </DropdownContainer>
    </>
  );
}
