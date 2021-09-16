import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

import {
  faCamera,
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
    screenshotMode,
    setScreenshotMode,
    setOrderListItems,
    orderListItems,
    Translator,
    setOrderListItemsNotes,
  } = useContext(OrderListContext);

  const [confirmClearOrderItems, setConfirmClearOrderItems] = useState(false);
  const [showModalConfirmDownload, setShowModalConfirmDownload] = useState(
    false,
  );

  const [zipFileName, setZIPFileName] = useState('');

  const history = useHistory();

  const {addToast} = useToasts();

  const handleClearAll = (confirmed = false) => {
    if (!confirmed) {
      setConfirmClearOrderItems(true);
      return;
    }

    setOrderListItems([]);
    setOrderListItemsNotes('');
    setConfirmClearOrderItems(false);
    addToast(Translator('TOAST_CLEARED_LIST'), {
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
        a.download = `${Translator('MAIN_TITLE')}.png`;
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

        addToast(Translator('TOAST_SCREENSHOT_FINISHED'), {
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
      zipFileName === '' ? Translator('MAIN_TITLE') : zipFileName;

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

      orderItem.clothingSettings.map((theClothe) => {
        // ADJUST SIZE FOR CHILDISH (IT CAME WITH WORK ANOS|YEARS|ANÕS)
        const theSize =
          orderItem.gender === 'CHILDISH'
            ? Translator(theClothe.size).replace(/ anos| years old| años/i, '')
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

    const csvHeader = [];
    csvHeader.push(Translator('CSVID_GENDER'));
    csvHeader.push(Translator('CSVID_NAME'));
    csvHeader.push(Translator('CSVID_NUMBER'));
    csvHeader.push(Translator('CSVID_TSHIRT'));
    csvHeader.push(Translator('CSVID_TSHIRTLONG'));
    csvHeader.push(Translator('CSVID_SHORTS'));
    csvHeader.push(Translator('CSVID_PANTS'));
    csvHeader.push(Translator('CSVID_TANKTOP'));
    csvHeader.push(Translator('CSVID_VEST'));

    // ADD CSV HEADER
    csvFullData.unshift(csvHeader.join(','));

    // ADD FILES TO ZIP
    zip.file(`${Translator('MAIN_TITLE')}.csv`, csvFullData.join('\n'));
    zip.file('Melista.bkp', btoa(localStorage.getItem('sisbot')));
    zip.file(
      `${Translator('INSTRUCTIONS_FILENAME')}.txt`,
      `${Translator('INSTRUCTIONS_CONTENT')}`,
    );

    // DOWNLOAD ZIP
    zip.generateAsync({type: 'blob'}).then((content) => {
      saveAs(content, `${safeFilename}.zip`);
    });

    setShowModalConfirmDownload(false);
    setZIPFileName('');

    addToast(Translator('TOAST_DOWNLOAD_COMPLETE'), {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  const handleCLoseModalTextInput = () => {
    setZIPFileName('');
    setShowModalConfirmDownload(false);
  };

  const handleRestoreBackup = (data) => {
    // PARSE THE RESULT
    const backupData = JSON.parse(atob(data));
    setOrderListItems(backupData.orderListItems);
    setOrderListItemsNotes(backupData.orderListItemsNotes);
    addToast(Translator('TOAST_UPLOAD_COMPLETE'), {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const handleUpload = () => {
    Utils.HandleUploadFile('.bkp', (content) => {
      handleRestoreBackup(content);
    });
  };

  return (
    <>
      {/* DELETE ALL */}
      <ModalConfirmDialog
        useDangerConfirm
        isOpen={confirmClearOrderItems}
        title={Translator('PROCEED_WITH_CAUTION')}
        textContent={Translator('CONFIRM_DELETE_ALL_ORDERITEMS')}
        handleConfirm={() => handleClearAll(true)}
        handleClose={() => setConfirmClearOrderItems(false)}
      />

      {/* DOWNLOAD */}
      <ModalTextInput
        isOpen={showModalConfirmDownload}
        title={Translator('DOWNLOAD_TITLE')}
        inputTextContent={zipFileName}
        labelContent={Translator('ASK_FILENAME')}
        placeholderContent={Translator('MAIN_TITLE')}
        handleChange={(e) => setZIPFileName(e.target.value)}
        handleConfirm={() => handleDownload(true)}
        handleClose={handleCLoseModalTextInput}
      />

      {/* ANNOTATIONS */}
      {/* <ModalTextInput
        isOpen={notesModalVisible}
        useTextarea
        title={Translator('PRODUCTION_NOTES')}
        inputTextContent={orderListItemsNotes}
        labelContent={Translator('PRODUCTION_NOTES_DESCRIPTION')}
        placeholderContent={Translator('PRODUCTION_NOTES_PLACEHOLDER')}
        handleChange={(e) => setOrderListItemsNotes(e.target.value)}
        handleConfirm={handleCloseAnnotations}
        handleClose={handleCloseAnnotations}
      /> */}

      <Row className="mt-4 mb-2">
        <Col className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => handleDownload()}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DOWNLOAD')}
            </span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={handleUpload}>
            <FontAwesomeIcon icon={faUpload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('UPLOAD')}
            </span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => handleClearAll()}>
            <FontAwesomeIcon icon={faEraser} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('CLEAR')}
            </span>
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
              {!screenshotMode
                ? Translator('TAKE_SCREENSHOT')
                : Translator('TAKING_SCREENSHOT')}
            </span>
          </Button>

          <Button
            variant="secondary"
            className="mr-2"
            size="sm"
            onClick={() => history.push('bussiness/pricing')}>
            <FontAwesomeIcon icon={faDollarSign} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('PRICES')}
            </span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => history.push('/report')}>
            <FontAwesomeIcon icon={faTable} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('REPORT')}
            </span>
          </Button>

          {/* <Button
            variant="secondary"
            size="sm"
            onClick={() => setNotesModalVisible(true)}>
            <FontAwesomeIcon
              icon={faCommentAlt}
              color={orderListItemsNotes.length > 0 ? '#f1c40f' : '#fff'}
            />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('NOTES')}
            </span>
          </Button> */}
        </Col>
      </Row>
    </>
  );
};

export default TableOrdersMenu;
