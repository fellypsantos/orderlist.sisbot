import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

import {
  faCamera,
  faCommentAlt,
  faDollarSign,
  faDownload,
  faEraser,
  faSpinner,
  faTable,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';
import {useHistory} from 'react-router-dom';

import saveAs from '../../../node_modules/jszip/vendor/FileSaver';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

import ModalConfirmDialog from '../ModalConfirmDialog';
import ModalTextInput from '../ModalTextInput';
import FontAwesomeIconSpinner from '../FontAwesomeIconSpinner';

const TableOrdersMenu = () => {
  const {
    setModalPricesOpened,
    screenshotMode,
    setScreenshotMode,
    setOrderListItems,
    orderListItems,
    Translator,
    orderListItemsNotes,
    setOrderListItemsNotes,
    setCurrentClothingPrices,
  } = useContext(OrderListContext);

  const [confirmClearOrderItems, setConfirmClearOrderItems] = useState(false);
  const [showModalConfirmDownload, setShowModalConfirmDownload] = useState(
    false,
  );

  const [notesModalVisible, setNotesModalVisible] = useState(false);

  const [zipFileName, setZIPFileName] = useState('');

  const history = useHistory();

  const {addToast} = useToasts();

  const handleClearAll = (confirmed = false) => {
    if (!confirmed) {
      setConfirmClearOrderItems(true);
      return;
    }

    setOrderListItems([]);
    setConfirmClearOrderItems(false);
    addToast('Feito! Sua lista de pedidos está limpa.', {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const handleScreenshot = async () => {
    setScreenshotMode(true);

    // CHANGE VIEWPORT TO SHOW ALL CONTENT AS DESKTOP
    const vp = document.getElementById('viewportMeta').getAttribute('content');
    document
      .getElementById('viewportMeta')
      .setAttribute('content', 'width=1000');

    // DISABLE SCROLL TO PREVENT MESSED UP SCREENSHORT
    document.body.style.overflow = 'hidden';

    await Utils.Sleep(1000);

    // GENERATE AND DOWNLOAD PNG FILE
    html2canvas(document.getElementById('tableOrderListItems'), {
      scrollY: -window.scrollY,
    })
      .then((canvas) => {
        // CREATE CANVAS ELEMENT
        const targetCanvas = canvas;
        targetCanvas.style.display = 'none';
        document.body.appendChild(targetCanvas);

        // CREATE LINK DO ACTIVE IMAGE DOWNLOAD
        const a = document.createElement('a');
        a.href = targetCanvas.toDataURL();
        a.download = 'Lista-2021-07-13.png';
        document.body.appendChild(a);
        a.click();

        // REMOVE DOM ELEMENTS TO PREVENT DUPLICATES
        a.remove();
        targetCanvas.remove();
      })
      .then(() => {
        // TURN OFF SCREENSHOT MODE
        setScreenshotMode(false);

        // RESTORE VIEWPORT TO FIT DEVICE
        document.getElementById('viewportMeta').setAttribute('content', vp);

        // ENABLE SCROLL AGAIN
        document.body.style.overflow = 'unset';

        addToast('Captura de tela foi salva na sua máquia.', {
          appearance: 'success',
          autoDismiss: true,
        });
      });
  };

  const handleDownload = (confirmed = false) => {
    if (!confirmed) {
      setShowModalConfirmDownload(true);
      return;
    }

    const zip = new JSZip();

    const safeFilename =
      zipFileName === '' ? 'SISBOT - Lista de Pedidos' : zipFileName;

    const sisbotGender = {
      MALE: 'ma',
      FEMALE: 'fe',
      CHILDISH: 'c',
    };

    const sisbotClothingID = {
      TSHIRT: 'CSVID_TSHIRT',
      TSHIRTLONG: 'CSVID_TSHIRTLONG',
      SHORTS: 'CSVID_SHORTS',
      PANTS: 'CSVID_PANTS',
      TANKTOP: 'CSVID_TANKTOP',
      VEST: 'CSVID_VEST',
    };

    const csvFullData = [];

    orderListItems.map((orderItem) => {
      const csvDataToJoin = [];
      const sisbotGenderTranslated = sisbotGender[orderItem.gender];
      csvDataToJoin.push(sisbotGenderTranslated);
      csvDataToJoin.push(orderItem.name);
      csvDataToJoin.push(orderItem.number);

      console.log('orderItem', orderItem);

      orderItem.clothingSettings.map((theClothe) => {
        // ADJUST SIZE FOR CHILDISH (IT CAME WITH WORK ANOS|YEARS|ANÕS)
        const theSize =
          orderItem.gender === 'CHILDISH'
            ? Translator(theClothe.size).replace(/ anos| aears| años/i, '')
            : Translator(theClothe.size);

        csvDataToJoin.push(
          `${Translator(sisbotClothingID[theClothe.name.toUpperCase()])}=${
            theClothe.quantity > 0 ? `${theClothe.quantity}-${theSize}` : ''
          }`,
        );
        return theClothe;
      });

      const csvRow = csvDataToJoin.join(',');
      csvFullData.push(csvRow);
      return orderItem;
    });

    // ADD CSV HEADER
    csvFullData.unshift(
      'genero,nome,numero,manga_curta,manga_longa,short,calca,regata,colete',
    );

    // ADD FILES TO ZIP
    zip.file('Lista de Pedidos.csv', csvFullData.join('\n'));
    zip.file('Dashboard.bkp', btoa(localStorage.getItem('sisbot')));

    // DOWNLOAD ZIP
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `${safeFilename}.zip`);
    });

    setShowModalConfirmDownload(false);
    setZIPFileName('');

    addToast('Pronto! O arquivo foi salvo som sucesso no seu computador.', {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  const handleCLoseModalTextInput = () => {
    setZIPFileName('');
    setShowModalConfirmDownload(false);
  };

  const handleCloseAnnotations = () => {
    setNotesModalVisible(false);
    addToast('Suas notas de produção foram atualizadas.', {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const handleRestoreBackup = (data) => {
    // PARSE THE RESULT
    const backupData = JSON.parse(atob(data));
    setOrderListItems(backupData.orderListItems);
    setOrderListItemsNotes(backupData.orderListItemsNotes);
    setCurrentClothingPrices(backupData.pricesList);
    addToast('Pronto! Todas as informações foram restauradas com sucesso.', {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const handleUpload = () => {
    const inputFileChooser = document.createElement('input');
    inputFileChooser.setAttribute('type', 'file');
    inputFileChooser.setAttribute('accept', '.bkp');
    inputFileChooser.setAttribute('className', 'd-none');
    inputFileChooser.onchange = (e) => {
      // READ CONTENT
      const fileReader = new FileReader();
      const {files} = e.target;

      if (files && files[0]) {
        fileReader.onload = (el) => {
          const {result} = el.target;
          handleRestoreBackup(result);
        };

        fileReader.readAsText(e.target.files[0]);
      }
    };

    inputFileChooser.click();
  };

  return (
    <>
      {/* DELETE ALL */}
      <ModalConfirmDialog
        useDangerConfirm
        isOpen={confirmClearOrderItems}
        title="Prossiga com Cuidado!"
        textContent="Tem certeza que deseja limpar completamente a sua lista de pedidos? Isso não pode ser desfeito!"
        handleConfirm={() => handleClearAll(true)}
        handleClose={() => setConfirmClearOrderItems(false)}
      />

      {/* DOWNLOAD */}
      <ModalTextInput
        isOpen={showModalConfirmDownload}
        title="Download da Lista"
        inputTextContent={zipFileName}
        labelContent="Qual o nome para o arquivo?"
        placeholderContent="SISBOT - Lista"
        handleChange={(e) => setZIPFileName(e.target.value)}
        handleConfirm={() => handleDownload(true)}
        handleClose={handleCLoseModalTextInput}
      />

      {/* ANNOTATIONS */}
      <ModalTextInput
        isOpen={notesModalVisible}
        useTextarea
        title="Notas para Produção"
        inputTextContent={orderListItemsNotes}
        labelContent="Descreva seus detalhes para produção."
        placeholderContent="Digite aqui..."
        handleChange={(e) => setOrderListItemsNotes(e.target.value)}
        handleConfirm={handleCloseAnnotations}
        handleClose={handleCloseAnnotations}
      />

      <Row className="mt-4 mb-2">
        <Col className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => handleDownload()}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">Download</span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={handleUpload}>
            <FontAwesomeIcon icon={faUpload} />
            <span className="ml-1 d-none d-md-inline-block">Upload</span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => handleClearAll()}>
            <FontAwesomeIcon icon={faEraser} />
            <span className="ml-1 d-none d-md-inline-block">Limpar</span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={handleScreenshot}>
            {!screenshotMode ? (
              <FontAwesomeIcon icon={faCamera} />
            ) : (
              <FontAwesomeIconSpinner icon={faSpinner} />
            )}
            <span className="ml-1 d-none d-md-inline-block">
              {!screenshotMode ? 'Capturar' : 'Capturando...'}
            </span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => setModalPricesOpened(true)}>
            <FontAwesomeIcon icon={faDollarSign} />
            <span className="ml-1 d-none d-md-inline-block">Preços</span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => history.push('/report')}>
            <FontAwesomeIcon icon={faTable} />
            <span className="ml-1 d-none d-md-inline-block">Relatório</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNotesModalVisible(true)}>
            <FontAwesomeIcon
              icon={faCommentAlt}
              color={orderListItemsNotes.length > 0 ? '#f1c40f' : '#fff'}
            />
            <span className="ml-1 d-none d-md-inline-block">Notas</span>
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default TableOrdersMenu;
