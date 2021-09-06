import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faFilePdf,
  faPenAlt,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {OrderListContext} from '../../contexts/OrderListContext';
import {ReportContext} from '../../contexts/ReportContext';

const ReportMenu = () => {
  const history = useHistory();
  const {Translator} = useContext(OrderListContext);
  const {setModalEditHeaderOpen} = useContext(ReportContext);

  const handleGeneratePDF = () => {
    html2canvas(document.getElementById('report')).then((canvas) => {
      const imagedata = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');

      pdf.addImage(imagedata, 'JPEG', 14, 25, 180, 235);
      pdf.save(`${Translator('PROCESSING_REPORT_TITLE')}.pdf`);
    });
  };

  return (
    <Row className="mt-4 mb-2 hide-on-print">
      <Col className="d-flex justify-content-end">
        {/* BACK */}
        <Button
          variant="secondary"
          className="mr-2"
          size="sm"
          onClick={() => history.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} />
          <span className="ml-1 d-none d-md-inline-block">
            {Translator('GOBACK')}
          </span>
        </Button>

        {/* EDIT HEADER */}
        <Button
          variant="secondary"
          className="mr-2"
          size="sm"
          onClick={() => setModalEditHeaderOpen(true)}>
          <FontAwesomeIcon icon={faPenAlt} />
          <span className="ml-1 d-none d-md-inline-block">
            {Translator('EDIT_REPORT_HEADER')}
          </span>
        </Button>

        {/* PRINT */}
        <Button
          variant="secondary"
          className="mr-2"
          size="sm"
          onClick={() => window.print()}>
          <FontAwesomeIcon icon={faPrint} />
          <span className="ml-1 d-none d-md-inline-block">
            {Translator('PRINT')}
          </span>
        </Button>

        {/* SAVE PDF */}
        <Button
          variant="secondary"
          className="mr-2"
          size="sm"
          onClick={handleGeneratePDF}>
          <FontAwesomeIcon icon={faFilePdf} />
          <span className="ml-1 d-none d-md-inline-block">
            {Translator('SAVE_PDF')}
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReportMenu;
