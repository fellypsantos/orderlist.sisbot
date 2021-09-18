import React, {useContext, useState} from 'react';
import {useToasts} from 'react-toast-notifications';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faEye,
  faEyeSlash,
  faDownload,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import JSZip from 'jszip';
import axios from 'axios';

import saveAs from '../../../node_modules/jszip/vendor/FileSaver';
import TableOrdersMenu from '../../components/TableOrdersMenu';
import FormAddOrderItem from '../../components/FormAddOrderItem';
import DashboardReports from '../../components/DashboardReports';
import Title from '../../components/Title';
import Separator from '../../components/Separator';
import TableOrderList from '../../components/TableOrderList';
import {OrderListContext} from '../../contexts/OrderListContext';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';
import ModalTextInput from '../../components/ModalTextInput';
import Utils from '../../Utils';

const Main = () => {
  const {
    Translator,
    showDashboard,
    setShowDashboard,
    orderListItems,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const [HCaptchaToken, setHCaptchaToken] = useState('');
  const [requestLoading, setRequestLoading] = useState(null);
  const [zipFileName, setZIPFileName] = useState('');
  const [showModalConfirmDownload, setShowModalConfirmDownload] = useState(
    false,
  );

  const [targetEmail, setTargetEmail] = useState('');
  const [showModalSendMail, setShowModalSendMail] = useState(false);

  const handleCLoseModalTextInput = () => {
    setZIPFileName('');
    setShowModalConfirmDownload(false);
  };

  const handleCloseModalSendMail = () => {
    setRequestLoading(null);
    setShowModalSendMail(false);
    setTargetEmail('');
    setHCaptchaToken('');
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

  const handleSendMail = async () => {
    // VALIDATE EMAIL
    if (!Utils.IsValidEmail(targetEmail)) {
      addToast(Translator('TOAST_INVALID_EMAIL'), {
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

    const postData = {
      token: HCaptchaToken,
      listContent: 'ab1iu1bhvbuy12089s7d',
    };

    const postFormData = new FormData();
    Object.keys(postData).map((key) => postFormData.append(key, postData[key]));

    const serverResponse = await axios.post(
      'http://10.0.0.100/hcaptcha/',
      postFormData,
      {
        headers: {'Content-Type': 'multipart/form-data'},
      },
    );

    if (serverResponse.data === true) {
      setRequestLoading(false);
      setTargetEmail('');
    } else {
      addToast(Translator('TOAST_FAILED_TO_SENT_LIST'), {
        autoDismiss: true,
        appearance: 'error',
      });
      setRequestLoading(null);
    }
  };

  return (
    <>
      <FormAddOrderItem />
      <Separator />

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

      {/* SEND VIA EMAIL */}
      <ModalTextInput
        isOpen={showModalSendMail}
        title={Translator('MODAL_TITLE_SENT_VIA_EMAIL')}
        hcaptchaEnabled
        hideHelpText
        hcaptchaSolved={(theToken) => setHCaptchaToken(theToken)}
        loadingRequest={requestLoading}
        labelContent={Translator('ASK_DESTINATION_EMAIL')}
        placeholderContent="sample@server.com"
        inputTextContent={targetEmail}
        handleChange={(e) => setTargetEmail(e.target.value.trim())}
        handleConfirm={handleSendMail}
        handleClose={handleCloseModalSendMail}
      />

      <div
        className="d-flex"
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Title text={Translator('MAIN_TITLE')} />
        <div>
          <Button
            variant="success"
            className="mr-2"
            size="sm"
            onClick={() => handleDownload()}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DOWNLOAD')}
            </span>
          </Button>

          <Button
            variant="primary"
            className="mr-2"
            size="sm"
            onClick={() => setShowModalSendMail(true)}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('SEND_MAIL')}
            </span>
          </Button>

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
        </div>
      </div>
      {showDashboard && (
        <>
          <DashboardReports />
          <TableOrdersMenu />
        </>
      )}
      <TableOrderList />
    </>
  );
};

export default Main;
