import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import {
  faCamera,
  faDollarSign,
  faDownload,
  faEraser,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';

const TableOrdersMenu = () => {
  const {setModalPricesOpened} = useContext(OrderListContext);

  return (
    <Row className="mt-4 mb-2">
      <Col className="d-flex justify-content-end">
        <Button variant="secondary" className="mr-2" size="sm">
          <FontAwesomeIcon icon={faDownload} />
          <span className="ml-1 d-none d-md-inline-block">Download</span>
        </Button>
        <Button variant="secondary" className="mr-2" size="sm">
          <FontAwesomeIcon icon={faUpload} />
          <span className="ml-1 d-none d-md-inline-block">Upload</span>
        </Button>
        <Button variant="secondary" className="mr-2" size="sm">
          <FontAwesomeIcon icon={faEraser} />
          <span className="ml-1 d-none d-md-inline-block">Limpar</span>
        </Button>
        <Button variant="secondary" className="mr-2" size="sm">
          <FontAwesomeIcon icon={faCamera} />
          <span className="ml-1 d-none d-md-inline-block">Capturar</span>
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setModalPricesOpened(true)}>
          <FontAwesomeIcon icon={faDollarSign} />
          <span className="ml-1 d-none d-md-inline-block">Preços</span>
        </Button>
      </Col>
    </Row>
  );
};

export default TableOrdersMenu;
