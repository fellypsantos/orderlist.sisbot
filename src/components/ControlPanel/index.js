import React, {useState} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';

import {Container, ToggleViewContainer, ToggleViewButton} from './styles';

const ControlPanel = ({children}) => {
  const [panelVisible, setPanelVisible] = useState(false);

  return (
    <Row className="mb-4">
      <Col>
        <ToggleViewContainer className="mt-4 mb-4">
          <ToggleViewButton onClick={() => setPanelVisible(!panelVisible)}>
            <FontAwesomeIcon icon={!panelVisible ? faCaretDown : faCaretUp} />
          </ToggleViewButton>
        </ToggleViewContainer>

        <Container className={!panelVisible ? 'd-none' : ''}>
          {children}
        </Container>
      </Col>
    </Row>
  );
};

export default ControlPanel;
