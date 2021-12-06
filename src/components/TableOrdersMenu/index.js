import React, {useContext, useState} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import html2canvas from 'html2canvas';

import {
  faCamera,
  faDollarSign,
  faEraser,
  faSpinner,
  faTable,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';
import {useHistory} from 'react-router-dom';

import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

import ModalConfirmDialog from '../ModalConfirmDialog';
import FontAwesomeIconSpinner from '../FontAwesomeIconSpinner';

const TableOrdersMenu = () => {
  const {
    screenshotMode,
    setScreenshotMode,
    setListName,
    setOrderListItems,
    setIsCycling,
    Translator,
    setOrderListItemsNotes,
  } = useContext(OrderListContext);

  const [confirmClearOrderItems, setConfirmClearOrderItems] = useState(false);

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

  const handleRestoreBackup = (data) => {
    // PARSE THE RESULT
    const backupData = JSON.parse(atob(data));
    setListName(backupData.listName);
    setIsCycling(backupData.isCycling);
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

      <Row className="mt-1">
        <Col className="d-flex justify-content-end">
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
