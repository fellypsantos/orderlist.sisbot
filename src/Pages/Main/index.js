import React, {useContext, useState} from 'react';
import {useToasts} from 'react-toast-notifications';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faDownload,
  faEnvelope,
  faPen,
  faCommentAlt,
  faList,
  faClipboard,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import JSZip from 'jszip';
import axios from 'axios';

import saveAs from '../../../node_modules/jszip/vendor/FileSaver';
import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';
import ModalTextInput from '../../components/ModalTextInput';
import Utils from '../../Utils';
import ModalSendViaEmail from '../../components/ModalSendViaEmail';
import {CustomInputAsHeaderText} from '../BussinessPricing/styles';
import ControlPanel from '../../components/ControlPanel';
import ModalSequencialList from '../../components/ModalSequencialList';
import ModalListManager from '../../components/ModalListManager';
import ModalPasteList from '../../components/PasteListModal';

// const HCAPTCHA_SERVER_CHECK = 'http://localhost/hcaptcha/';
const HCAPTCHA_SERVER_CHECK = 'https://list.oneformes.com/hcaptcha/';

const Main = () => {
  const {
    Translator,
    showDashboard,
    setShowDashboard,
    setOrderListItems,
    setOrderListItemsNotes,
    orderListClientNotes,
    setOrderListClientNotes,
    listName,
    setListName,
    companyEmail,
    modalSequencialListOpen,
    settings,
    setSettings,
    sublists,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const [HCaptchaToken, setHCaptchaToken] = useState('');
  const [requestLoading, setRequestLoading] = useState(null);
  const [zipFileName, setZIPFileName] = useState('');
  const [groupFilesBySize, setGroupFilesBySize] = useState(false);
  const [showModalConfirmDownload, setShowModalConfirmDownload] =
    useState(false);

  const [clientName, setClientName] = useState('');
  const [targetEmail, setTargetEmail] = useState(companyEmail);
  const [showModalSendMail, setShowModalSendMail] = useState(false);
  const [showModalAnnotations, setShowModalAnnotations] = useState(false);
  const [showModalListManager, setShowModalListManager] = useState(false);
  const [showModalPasteList, setShowModalPasteList] = useState(false);

  const handleCLoseModalTextInput = () => {
    setZIPFileName('');
    setShowModalConfirmDownload(false);
  };

  const handleCloseModalSendMail = () => {
    setRequestLoading(null);
    setShowModalSendMail(false);
    setClientName('');
    setTargetEmail('');
    setHCaptchaToken('');
  };

  const canSeparateListBySize = (pOrderListItem) => {
    let invalidOrderItemToSeparate = 0;

    // LOOP THROUGH EACH ORDER ITEM
    pOrderListItem.forEach((orderItem) => {
      // REMOVE EMPTY CLOTHES FROM CHECKING
      const validClothes = orderItem.clothingSettings.filter(
        (clotheItem) => clotheItem.quantity > 0,
      );

      let lastClotheSize = null;
      let validationPassed = true;

      // COUNT INVALID CLOTHES IN CURRENT ORDER ITEM
      validClothes.forEach((clotheItem) => {
        // UPDATE CONTROL VARIABLE IN FIRST LOOP
        if (lastClotheSize === null) lastClotheSize = clotheItem.size;

        // ORDER ITEM HAS MANY SIZES
        if (clotheItem.size !== lastClotheSize) validationPassed = false;
      });

      if (!validationPassed) invalidOrderItemToSeparate += 1;
    });

    // INVALID CLOTHES FOUND
    if (invalidOrderItemToSeparate > 0) {
      return false;
    }

    return true;
  };

  const generateZip = async () => {
    const zip = new JSZip();

    // ADD INSTRUCTIONS
    const instructionsFile = `${Translator('INSTRUCTIONS_FILENAME')}.txt`;
    const instructionsContent = `${Translator('INSTRUCTIONS_CONTENT')}`;
    zip.file(instructionsFile, instructionsContent);

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
      SOCKS: 'CSVID_SOCKS',
    };

    let csvFullData = [];

    const prepareCSVFile = (targetOrderList) => {
      targetOrderList.forEach((orderItem) => {
        const firstClothe = orderItem.clothingSettings.filter(
          (item) => item.gender !== '',
        )[0];

        const csvDataToJoin = [];
        const sisbotGenderTranslated = sisbotGender[firstClothe.gender];
        csvDataToJoin.push(sisbotGenderTranslated);
        csvDataToJoin.push(orderItem.name);
        csvDataToJoin.push(orderItem.number);

        orderItem.clothingSettings.map((theClothe) => {
          // ADJUST SIZE FOR CHILDISH (IT CAME WITH WORD ANOS|YEARS|ANÕS)
          const theSize =
            firstClothe.gender === 'CHILDISH'
              ? Translator(theClothe.size).replace(
                  / anos| years old| años/i,
                  '',
                )
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
      csvHeader.push(Translator('CSVID_SOCKS'));

      // ADD CSV HEADER
      csvFullData.unshift(csvHeader.join(','));
    };

    // GENERATE ANNOTATIONS FILE IF USER TYPED SOMETING
    if (orderListClientNotes.length > 0) {
      zip.file(`${Translator('ANNOTATIONS')}.txt`, orderListClientNotes);
    }

    // JOIN MAIN LIST + SUBLISTS
    const currentSelectedList = JSON.parse(localStorage.getItem('sisbot'));
    const mergedLists = [currentSelectedList, ...sublists];

    // GENERATE SINGLE CSV FILE
    if (!groupFilesBySize) {
      mergedLists.map(async (listItem) => {
        const projectName = listItem.listName || listItem.id;
        const csvFileName = `${projectName || Translator('MAIN_TITLE')}.csv`;
        const backupContent = btoa(JSON.stringify(listItem));

        // PREPARE HEADER
        prepareCSVFile(listItem.orderListItems);

        // ADD FILES TO ZIP
        zip.folder(projectName).file(csvFileName, csvFullData.join('\n'));
        zip.folder(projectName).file(`${projectName}.bkp`, backupContent);
        csvFullData = []; // clear to process next csv item
      });

      // DOWNLOAD ZIP
      const blobContent = await zip.generateAsync({type: 'blob'});
      return blobContent;
    }

    // GENERATE CSV FILES GROUPED BY SIZE
    if (groupFilesBySize) {
      let canProcess = true;

      // VALIDATION
      mergedLists.map(async (listItem) => {
        const isOK = canSeparateListBySize(listItem.orderListItems);
        const errorToast = `${Translator('TOAST_VARIABLE_SIZES_AT')}${
          listItem.listName
        }`;

        // Shows with list has problems
        if (!isOK) {
          addToast(errorToast, {
            autoDismiss: false,
            appearance: 'warning',
          });

          canProcess = isOK;
        }
      });

      if (!canProcess) {
        addToast(Translator('TOAST_CANT_SEPARATE_BY_SIZE'), {
          autoDismiss: true,
          appearance: 'error',
        });
        return null;
      } // Any of your lists has size variation

      // EACH SIZE WILL GENERATE A CSV FILE IF NOT EMPTY
      mergedLists.map(async (listItem) => {
        const projectName = listItem.listName || listItem.id;

        // Hold sorted items
        const orderItemGroupedBySize = {
          'T-PP': [],
          'T-P': [],
          'T-M': [],
          'T-G': [],
          'T-GG': [],
          'T-XG': [],
          'T-2XG': [],
          'T-3XG': [],
          'T-4XG': [],
          'T-2A': [],
          'T-4A': [],
          'T-6A': [],
          'T-8A': [],
          'T-10A': [],
          'T-12A': [],
          'T-14A': [],
          'T-16A': [],
        };

        // ORGANIZE ORDER ITEM SEPARATING EACH ITEM AS INDIVIDUAL ARRAY FOR THAT SIZE
        listItem.orderListItems.forEach((orderItem) => {
          const noEmptyClothes = orderItem.clothingSettings.filter(
            (clotheItem) => clotheItem.quantity > 0,
          );

          const selectedSize = noEmptyClothes[0].size;
          orderItemGroupedBySize[selectedSize].push(orderItem);
        });

        // NOW THE SIZES ARE SEPARATED, LOOP THROUGH IT GENERATING CSV's
        Object.keys(orderItemGroupedBySize).forEach(async (key) => {
          const group = orderItemGroupedBySize[key];
          if (group.length === 0) return false;
          prepareCSVFile(group);

          // ADD FILES TO ZIP
          zip
            .folder(projectName)
            .file(`${Translator(key)}.csv`, csvFullData.join('\n'));

          csvFullData = []; // CLEAR TO NEXT PROCESSING
        }); // FINISHED GROUP PROCESSING

        // ADD EXTRA FILES
        const backupContent = btoa(JSON.stringify(listItem));
        zip.folder(projectName).file(`${projectName}.bkp`, btoa(backupContent));
      }); // end map

      // DOWNLOAD ZIP
      const blobContent = await zip.generateAsync({type: 'blob'});
      return blobContent;
    }
  };

  const handleDownload = async (confirmed = false) => {
    if (!confirmed) {
      setShowModalConfirmDownload(true);
      return;
    }

    const safeFilename =
      zipFileName === '' ? Translator('MAIN_TITLE') : zipFileName;

    const zipData = await generateZip();

    // Reset modal and group status
    setShowModalConfirmDownload(false);
    setGroupFilesBySize(false);

    // VALIDATE ZIP DATA
    if (zipData === undefined || zipData === null) {
      addToast(Translator('TOAST_FAILED_GENERATE_ZIP'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    // SUCCESS
    saveAs(zipData, `${safeFilename}.zip`);
    setZIPFileName('');

    addToast(Translator('TOAST_DOWNLOAD_COMPLETE'), {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  const handleSendMail = async () => {
    // VALIDATE EMAIL
    if (!Utils.IsValidEmail(targetEmail)) {
      addToast(Translator('TOAST_INVALID_EMAIL'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    // VALIDATE CLIENT NAME
    if (clientName.trim() === '') {
      addToast(Translator('TOAST_EMPTY_CLIENT_NAME'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    // VALIDATE HCAPTCHA
    if (HCaptchaToken === '') {
      addToast(Translator('TOAST_MUST_SOLVE_CAPTCHA'), {
        autoDismiss: true,
        appearance: 'error',
      });

      return;
    }

    setRequestLoading(true);
    const zipData = await generateZip();

    const postData = {
      token: HCaptchaToken,
      uuidPriceTable: settings.uuidFromLoadedPriceTable,
      zipfile: zipData,
      email: targetEmail,
      client: clientName,
      translatedText: JSON.stringify({
        emailTitle: Translator('MAIN_TITLE'),
        emailBody: Translator('EMAIL_BODY'),
        labelClient: Translator('CLIENT'),
      }),
    };

    const postFormData = new FormData();
    Object.keys(postData).map((key) => postFormData.append(key, postData[key]));

    const serverResponse = await axios
      .post(HCAPTCHA_SERVER_CHECK, postFormData, {
        headers: {'Content-Type': 'multipart/form-data'},
        timeout: 15000,
      })
      .catch((error) => {
        addToast(Translator('TOAST_AXIOS_ERROR'), {
          autoDismiss: true,
          appearance: 'error',
        });

        setRequestLoading(null);

        console.log('AXIOS_ERROR: ', error);
      });

    if (serverResponse === undefined) return;

    if (serverResponse.data === true) {
      // Sent successfully
      setRequestLoading(false);
      setTargetEmail('');
      if (settings.shouldClearOrderListAfterSent) {
        setOrderListItems([]); // Remove list from client
        setOrderListItemsNotes('');
      }

      // update settings
      setSettings({
        ...settings,
        uuidFromLoadedPriceTable: '',
        shouldClearOrderListAfterSent: false,
      }); // Remove last uuid loaded
    } else {
      addToast(Translator('TOAST_FAILED_TO_SENT_LIST'), {
        autoDismiss: true,
        appearance: 'error',
      });
      setRequestLoading(null);
    }
  };

  const DropDownButtonToDownload = () =>
    !settings.shouldClearOrderListAfterSent && (
      <Dropdown className="mr-2 d-inline-block">
        <Dropdown.Toggle variant="success" size="sm">
          <FontAwesomeIcon icon={faDownload} className="mr-1" />
          <span className="d-none d-md-inline-block">
            {Translator('DOWNLOAD')}
          </span>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleDownload(false)}>
            {Translator('DOWNLOAD_DEFAULT')}
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              setGroupFilesBySize(true);
              handleDownload(false);
            }}>
            {Translator('DOWNLOAD_GROUP_BY_SIZE')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

  const SendEmailButton = () => (
    <Button
      className="mr-2"
      variant="primary"
      size="sm"
      onClick={() => setShowModalSendMail(true)}>
      <FontAwesomeIcon icon={faEnvelope} />
      <span className="ml-1 d-none d-md-inline-block">
        {Translator('SEND_MAIL')}
      </span>
    </Button>
  );

  const WriteClientNotes = () => (
    <Button
      variant="secondary"
      className="mr-2"
      size="sm"
      onClick={() => setShowModalAnnotations(true)}>
      <FontAwesomeIcon
        icon={orderListClientNotes.length === 0 ? faPen : faCommentAlt}
      />
      <span className="ml-1 d-none d-md-inline-block">
        {Translator('ANNOTATIONS')}
      </span>
    </Button>
  );

  const ManagerList = () => (
    <Button
      variant="secondary"
      className="mr-2"
      size="sm"
      onClick={() => setShowModalListManager(true)}>
      <FontAwesomeIcon icon={faList} />
      <span className="ml-1 d-none d-md-inline-block">
        {Translator('LIST_MANAGER')}
      </span>
    </Button>
  );
  const PasteList = () => (
    <Button
      variant="secondary"
      className="mr-2"
      size="sm"
      onClick={() => setShowModalPasteList((isShowing) => !isShowing)}
    >
      <FontAwesomeIcon icon={faClipboard} />
      <span className="ml-1 d-none d-md-inline-block">
        {Translator('PASTE_LIST')}
      </span>
    </Button>
  );
  return (
    <>
      <FormAddOrderItem />

      {/* CONTROL PANEL CAN SHOW/HIDE */}
      <ControlPanel>
        <Row>
          {/* DASHBOARD BUTTONS */}
          <Col className="text-right mb-4">
            <PasteList />
            <ManagerList />
            <DropDownButtonToDownload />
            <SendEmailButton />
            <WriteClientNotes />
            <Button
              className="mr-2"
              variant="secondary"
              size="sm"
              onClick={() => setShowDashboard(!showDashboard)}>
              <FontAwesomeIcon
                icon={showDashboard ? faEyeSlash : faEye}
                width={35}
              />
              <span className="ml-1 d-none d-md-inline-block">
                {showDashboard
                  ? Translator('DASHBOARD_BUTTON_HIDE')
                  : Translator('DASHBOARD_BUTTON_SHOW')}
              </span>
            </Button>

            <ButtonToggleClothignIcons />
          </Col>
        </Row>

        {/* DASHBOARD BLOCKS WITH VALUES */}
        {showDashboard && <DashboardReports />}

        {/* BUTTONS TO CONTROL TABLE WITH ORDERS */}
        <TableOrdersMenu />
      </ControlPanel>

      <Row>
        <Col xs="12" sm="5">
          {/* INPUT FOR LIST NAME */}
          <CustomInputAsHeaderText
            type="text"
            value={listName}
            placeholder={Translator('MAIN_TITLE')}
            onChange={({target}) => setListName(target.value)}
          />
        </Col>
      </Row>

      {/* paste list */}
      {showModalPasteList && (
        <ModalPasteList
          isOpen={showModalPasteList}
          handleClose={() => setShowModalPasteList(false)}
        />
      )}

      {/* DOWNLOAD */}
      <ModalTextInput
        isOpen={showModalConfirmDownload}
        title={Translator('DOWNLOAD_TITLE')}
        inputTextContent={zipFileName}
        labelContent={Translator('ASK_FILENAME')}
        placeholderContent={Translator('MAIN_TITLE')}
        handleChange={(e) => setZIPFileName(e.target.value)}
        handleConfirm={() => handleDownload(true, groupFilesBySize)}
        handleClose={handleCLoseModalTextInput}
      />

      {/* SEND VIA EMAIL */}
      <ModalSendViaEmail
        name={clientName}
        email={targetEmail}
        handleChangeName={({target}) => setClientName(target.value)}
        handleChangeEmail={({target}) => setTargetEmail(target.value.trim())}
        isOpen={showModalSendMail}
        handleConfirm={handleSendMail}
        handleClose={handleCloseModalSendMail}
        requestLoading={requestLoading}
        hcaptchaSolved={(responseToken) => setHCaptchaToken(responseToken)}
      />

      {/* GENERATE SEQUENCIAL LIST */}
      <ModalSequencialList isOpen={modalSequencialListOpen} />

      {/* CLENT ANNOTATIONS TO SEND IN ZIP */}
      <ModalTextInput
        isOpen={showModalAnnotations}
        useTextarea
        title={Translator('ANNOTATIONS')}
        inputTextContent={orderListClientNotes}
        labelContent={Translator('ANNOTATIONS_CLIENT_LABEL')}
        placeholderContent={Translator('ANNOTATIONS')}
        handleChange={(e) => setOrderListClientNotes(e.target.value)}
        handleConfirm={() => setShowModalAnnotations(false)}
        handleClose={() => setShowModalAnnotations(false)}
      />

      {/* SUBLISTS MANAGER */}
      <ModalListManager
        isOpen={showModalListManager}
        handleClose={() => setShowModalListManager(false)}
      />

      {/* MAIN TABLE SHOWN ORDERS */}
      <TableOrderList />

      {/* NEW POSITION FOR MAIN BUTTONS */}
      <Row className="mt-2">
        <Col className="d-flex justify-content-center">
          <ManagerList />
          <WriteClientNotes />
          <DropDownButtonToDownload />
          <SendEmailButton />
        </Col>
      </Row>
    </>
  );
};

export default Main;
