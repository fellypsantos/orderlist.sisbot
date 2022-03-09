import React, {useEffect, useState, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useHistory} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import hash from 'object-hash';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

import {
  faArrowLeft,
  faCopy,
  faDownload,
  faLink,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';

import TableCellAsInput from '../../components/TableCellAsInput';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';
import ModalConfirmDialog from '../../components/ModalConfirmDialog';

const API = 'https://list.oneformes.com/api';
const LS_PRICES_ID = 'sisbot.bussiness.prices';
const LS_COMPANY_INFORMATIONS = 'sisbot.bussiness.company';

const BussinessPricing = () => {
  const {
    clothingIcons,
    clothingSizes,
    Translator,
    isCycling,
    setCurrentClothingPrices,
    orderListItems,
    setOrderListItems,
    setSettings,
    settings,
    shouldFilter,
    setShouldFilter,
    companyName,
    companyEmail,
    setCompanyEmail,
  } = useContext(OrderListContext);

  const [projectName, setProjectName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const history = useHistory();

  const [priceTableMale, setPriceTableMale] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const [priceTableFemale, setPriceTableFemale] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

  const [priceTableChildish, setPriceTableChildish] = useState({
    tshirt: [0, 0, 0, 0, 0, 0, 0, 0],
    tshirtLong: [0, 0, 0, 0, 0, 0, 0, 0],
    shorts: [0, 0, 0, 0, 0, 0, 0, 0],
    pants: [0, 0, 0, 0, 0, 0, 0, 0],
    tanktop: [0, 0, 0, 0, 0, 0, 0, 0],
    vest: [0, 0, 0, 0, 0, 0, 0, 0],
  });

  const [priceTableUnique, setPriceTableUnique] = useState({
    socks: [0],
  });

  const {addToast} = useToasts();

  const saveToLocalStorage = (pProjectName = '', pCompanyEmail = '') => {
    // SETTING DEFAULT EMPTY DATA
    localStorage.setItem(
      LS_PRICES_ID,
      JSON.stringify({
        projectName: pProjectName,
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
        priceTableUnique,
      }),
    );

    localStorage.setItem(
      LS_COMPANY_INFORMATIONS,
      JSON.stringify({
        companyName: companyName,
        companyEmail: pCompanyEmail,
      }),
    );
  };

  const isValidJsonFileForPrices = (object) => {
    if (
      object.projectName !== undefined &&
      object.priceTableMale !== undefined &&
      object.priceTableFemale !== undefined &&
      object.priceTableChildish !== undefined &&
      object.priceTableUnique !== undefined
    ) {
      return true;
    }

    return false;
  };

  const generateLink = async (shouldClearOrderListAfterSent) => {
    await fetch(`${API}/generateLink.php`, {
      method: 'POST',
      body: JSON.stringify({
        projectName,
        companyEmail,
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
        priceTableUnique,
        settings: {
          ...settings,
          filterEnabled: shouldFilter,
          shouldClearOrderListAfterSent,
        },
      }),
    })
      .then((response) => response.text())
      .then((responseText) => {
        const generatedURL = `${window.location.origin}/${window.location.hash}?query=${responseText}`;
        console.log('generatedURL', generatedURL);
        setGeneratedLink(generatedURL);
      });
  };

  const loadLink = async (query) => {
    await fetch(`${API}/loadLink.php?query=${query}`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson !== null) {
          const uploaded = JSON.parse(responseJson.conteudo);
          if (isValidJsonFileForPrices(uploaded)) {
            setProjectName(uploaded.projectName);
            setCompanyEmail(uploaded.companyEmail);
            setPriceTableMale(uploaded.priceTableMale);
            setPriceTableFemale(uploaded.priceTableFemale);
            setPriceTableChildish(uploaded.priceTableChildish);
            setPriceTableUnique(uploaded.priceTableUnique);

            setSettings({
              ...uploaded.settings,
              uuidFromLoadedPriceTable: responseJson.uuid,
            });

            setShouldFilter(uploaded.settings.filterEnabled);

            addToast(Translator('TOAST_DATA_LOADED_FROM_SERVER'), {
              autoDismiss: true,
              appearance: 'success',
            });

            addToast(Translator('TOAST_REDIRECTING'), {
              autoDismiss: true,
              appearance: 'success',
            });

            // WAIT TO REDIRECT
            setTimeout(() => history.push('/'), 3500);
          }
        } else {
          addToast(Translator('LINK_EXPIRED'), {
            autoDismiss: true,
            appearance: 'error',
          });

          // INSTA REDIRECT
          history.push('/');
        }
      });
  };

  // LOAD DATA FROM LOCALSTORAGE
  useEffect(() => {
    const theQuery = window.location.hash.split('?query=')[1];
    if (theQuery !== undefined) {
      console.log('LOAD FROM SERVER!', theQuery, typeof theQuery);
      loadLink(theQuery);
      return;
    }

    const localStorageBussinessPrices = localStorage.getItem(LS_PRICES_ID);
    const localStorageCompanyData = localStorage.getItem(
      LS_COMPANY_INFORMATIONS,
    );

    if (
      localStorageBussinessPrices !== null &&
      localStorageCompanyData !== null
    ) {
      // ALREADY EXISTS DATA
      console.log('ALREADY EXISTS DATA, RESTORE IT');
      const data = JSON.parse(localStorageBussinessPrices);
      const companyData = JSON.parse(localStorageCompanyData);

      // RESTORE PROJECT NAME
      setProjectName(data.projectName);

      // RESTORE COMPANY EMAIL
      setCompanyEmail(companyData.companyEmail);

      // RESTORE MALE PRICES IF ARE DIFFERENT
      if (hash(priceTableMale) !== hash(data.priceTableMale)) {
        setPriceTableMale(data.priceTableMale);
      }

      // RESTORE FEMALE PRICES
      if (hash(priceTableFemale) !== hash(data.priceTableFemale)) {
        setPriceTableFemale(data.priceTableFemale);
      }

      // RESTORE CHILDISH PRICES
      if (hash(priceTableChildish) !== hash(data.priceTableChildish)) {
        setPriceTableChildish(data.priceTableChildish);
      }

      // RESTORE UNIQUE PRICES
      if (hash(priceTableUnique) !== hash(data.priceTableUnique)) {
        setPriceTableUnique(data.priceTableUnique);
      }
    } else {
      // DEFAULT DATA
      saveToLocalStorage();
      console.log('EMPTY DATA SETTED');
    }
  }, []);

  // SAVE CHANGES TO LOCALSTORAGE
  useEffect(() => {
    saveToLocalStorage(projectName, companyEmail);

    // UPDATE CONTEXT TO REFLECT CHANGES IN MAIN PAGE PRICES
    setCurrentClothingPrices({
      projectName,
      priceTableMale,
      priceTableFemale,
      priceTableChildish,
      priceTableUnique,
    });

    // FORCE RE-RENDER TABLE TO UPDATE TOTAL PRICE OF EACH ROW
    setOrderListItems([...orderListItems]);
  }, [
    projectName,
    companyEmail,
    priceTableMale,
    priceTableFemale,
    priceTableChildish,
    priceTableUnique,
  ]);

  const handleUpdatePriceTable = (
    thePriceTableID,
    theClotheName,
    newPrice,
    indexPrice,
  ) => {
    let selectedPriceTable = null;

    switch (thePriceTableID) {
      case 'MALE':
        selectedPriceTable = priceTableMale;
        break;
      case 'FEMALE':
        selectedPriceTable = priceTableFemale;
        break;
      case 'CHILDISH':
        selectedPriceTable = priceTableChildish;
        break;
      default:
        selectedPriceTable = priceTableUnique;
    }

    const updated = selectedPriceTable[theClotheName].map((item, index) => {
      if (index === indexPrice) {
        if (newPrice === '') return 0;

        const thePriceSanitizedV1 = newPrice.replace(settings.coinPrefix, '');
        const thePriceSanitizedV2 = thePriceSanitizedV1.replace('$', '');
        const thePriceTrim = thePriceSanitizedV2.trim();
        const thePriceAsFloat = parseFloat(thePriceTrim);

        return thePriceAsFloat;
      }

      return item;
    });

    switch (thePriceTableID) {
      case 'MALE':
        setPriceTableMale({
          ...selectedPriceTable,
          [theClotheName]: [...updated],
        });
        break;
      case 'FEMALE':
        setPriceTableFemale({
          ...selectedPriceTable,
          [theClotheName]: [...updated],
        });
        break;
      case 'CHILDISH':
        setPriceTableChildish({
          ...selectedPriceTable,
          [theClotheName]: [...updated],
        });
        break;
      default:
        setPriceTableUnique({
          ...selectedPriceTable,
          [theClotheName]: [...updated],
        });
    }

    setCurrentClothingPrices({
      projectName,
      priceTableMale,
      priceTableFemale,
      priceTableChildish,
      priceTableUnique,
    });
  };

  const handleUploadPricesTables = () => {
    Utils.HandleUploadFile('.json', (content) => {
      const uploaded = JSON.parse(content);
      if (isValidJsonFileForPrices(uploaded)) {
        setCompanyEmail(uploaded.companyEmail);
        setProjectName(uploaded.projectName);
        setPriceTableMale(uploaded.priceTableMale);
        setPriceTableFemale(uploaded.priceTableFemale);
        setPriceTableChildish(uploaded.priceTableChildish);
        setPriceTableUnique(uploaded.priceTableUnique);
        setSettings(uploaded.settings);
        setShouldFilter(uploaded.settings.filterEnabled);

        addToast(Translator('TOAST_UPLOAD_COMPLETE'), {
          appearance: 'success',
          autoDismiss: true,
        });
      }
    });
  };

  const handleDownloadPricesTables = () => {
    const jsonContent = encodeURIComponent(
      JSON.stringify({
        projectName,
        companyEmail,
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
        priceTableUnique,
        settings: {
          ...settings,
          filterEnabled: shouldFilter,
        },
      }),
    );

    const anchor = document.createElement('a');
    anchor.setAttribute('href', `data:text/plain;charset=utf-8,${jsonContent}`);
    anchor.setAttribute(
      'download',
      `${projectName || Translator('UNTITLED')}.json`,
    );
    anchor.click();
    anchor.remove();

    addToast(Translator('TOAST_DOWNLOAD_COMPLETE'), {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  const handleChangeFileNameToExport = (element) => {
    setProjectName(element.target.value);
  };

  const handleValidateEmail = (email) => {
    if (email === '') return;

    if (!Utils.IsValidEmail(email)) {
      addToast(Translator('TOAST_INVALID_EMAIL'), {
        autoDismiss: true,
        appearance: 'error',
      });

      setCompanyEmail('');
      return false;
    }
  };

  const handleOnCopy = () => {
    addToast(Translator('TOAST_COPIED_TO_CLIPBOARD'), {
      autoDismiss: true,
      appearance: 'success',
    });
  };

  return (
    <div>
      <Row>
        {/* BUTTONS */}
        <Col className="text-right mb-4">
          {/* BACK */}
          <Button
            className="mr-2"
            variant="primary"
            size="sm"
            onClick={() => history.push('/')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('GOBACK')}
            </span>
          </Button>

          {/* DOWNLOAD */}
          <Button
            className="mr-2"
            variant="secondary"
            size="sm"
            onClick={handleDownloadPricesTables}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DOWNLOAD')}
            </span>
          </Button>

          {/* UPLOAD */}
          <Button
            className="mr-2"
            variant="secondary"
            size="sm"
            onClick={handleUploadPricesTables}>
            <FontAwesomeIcon icon={faUpload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('UPLOAD')}
            </span>
          </Button>

          <ButtonToggleClothignIcons />
        </Col>
      </Row>

      {/* INPUTS */}
      <Row>
        <Col xs="12" sm="6">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{Translator('BUDGET_IDENTIFICATION')}:</Form.Label>
              <Form.Control
                type="text"
                placeholder={Translator('UNTITLED')}
                value={projectName}
                onChange={handleChangeFileNameToExport}
              />
            </Form.Group>
          </Form>
        </Col>

        <Col xs="12" sm="6">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>{Translator('COMPANY_EMAIL')}:</Form.Label>
              <Form.Control
                type="email"
                placeholder="sample@server.com"
                value={companyEmail}
                onChange={({target}) => {
                  setCompanyEmail(target.value.replace(/\s/g, ''));
                }}
                onBlur={({target}) => handleValidateEmail(target.value)}
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>

      <Tabs className="mb-3">
        {/* MALE */}
        <Tab eventKey="tabMale" title={Translator('MALE')}>
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes
                  .filter((item) => item.gender === 'MALE')
                  .map((theSize) => (
                    <th key={theSize.id}>{Translator(theSize.value)}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
                  if (key === 'socks') return false;

                  // Always return no variant clothes
                  if (clothingIcons[key].isCycling === undefined) return true;

                  // Only return bike or normal clothes, never both;
                  if (clothingIcons[key].isCycling !== isCycling) return false;

                  return true;
                })
                .map((key) => (
                  <tr className="text-center" key={key}>
                    <td>
                      <img
                        src={clothingIcons[key].icon}
                        alt="icon"
                        height={25}
                      />
                    </td>
                    {clothingSizes
                      .filter((item) => item.gender === 'MALE')
                      .map((theSize, index) => {
                        const genericKey = key.replace('Cycling', '');
                        const itemPrice = priceTableMale[genericKey][index];
                        const itemPriceAsFloat = parseFloat(itemPrice);

                        return (
                          <td key={theSize.id}>
                            <TableCellAsInput
                              value={itemPrice > 0 ? itemPriceAsFloat : ''}
                              handleBlur={({target}) => {
                                handleUpdatePriceTable(
                                  'MALE',
                                  genericKey,
                                  target.value,
                                  index,
                                );
                              }}
                            />
                          </td>
                        );
                      })}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>

        {/* FEMALE */}
        <Tab eventKey="tabFemale" title={Translator('FEMALE')}>
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes
                  .filter((item) => item.gender === 'FEMALE')
                  .map((theSize) => (
                    <th key={theSize.id}>{Translator(theSize.value)}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
                  if (key === 'socks') return false;

                  // Always return no variant clothes
                  if (clothingIcons[key].isCycling === undefined) return true;

                  // Only return bike or normal clothes, never both;
                  if (clothingIcons[key].isCycling !== isCycling) return false;

                  return true;
                })
                .map((key) => (
                  <tr className="text-center" key={key}>
                    <td>
                      <img
                        src={clothingIcons[key].icon}
                        alt="icon"
                        height={25}
                      />
                    </td>
                    {clothingSizes
                      .filter((item) => item.gender === 'FEMALE')
                      .map((theSize, index) => {
                        const genericKey = key.replace('Cycling', '');
                        const itemPrice = priceTableFemale[genericKey][index];
                        const itemPriceAsFloat = parseFloat(itemPrice);

                        return (
                          <td key={theSize.id}>
                            <TableCellAsInput
                              value={itemPrice > 0 ? itemPriceAsFloat : ''}
                              handleBlur={({target}) => {
                                handleUpdatePriceTable(
                                  'FEMALE',
                                  genericKey,
                                  target.value,
                                  index,
                                );
                              }}
                            />
                          </td>
                        );
                      })}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>

        {/* CHILDISH */}
        <Tab eventKey="tabChildish" title={Translator('CHILDISH')}>
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes
                  .filter((item) => item.gender === 'CHILDISH')
                  .map((theSize) => (
                    <th key={theSize.id}>{Translator(theSize.value)}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
                  if (key === 'socks') return false;

                  // Always return no variant clothes
                  if (clothingIcons[key].isCycling === undefined) return true;

                  // Only return bike or normal clothes, never both;
                  if (clothingIcons[key].isCycling !== isCycling) return false;

                  return true;
                })
                .map((key) => (
                  <tr className="text-center" key={key}>
                    <td>
                      <img
                        src={clothingIcons[key].icon}
                        alt="icon"
                        height={25}
                      />
                    </td>
                    {clothingSizes
                      .filter((item) => item.gender === 'CHILDISH')
                      .map((theSize, index) => {
                        // CHILDISH START IN HIGHER INDEX ON LIST, SUBTRACT TO CONSIDER ZERO
                        const genericKey = key.replace('Cycling', '');
                        const itemPrice = priceTableChildish[genericKey][index];

                        const itemPriceAsFloat = parseFloat(itemPrice);
                        return (
                          <td key={theSize.id}>
                            <TableCellAsInput
                              value={itemPrice > 0 ? itemPriceAsFloat : ''}
                              handleBlur={({target}) => {
                                handleUpdatePriceTable(
                                  'CHILDISH',
                                  genericKey,
                                  target.value,
                                  index,
                                );
                              }}
                            />
                          </td>
                        );
                      })}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>

      {/* TABLE FOR SOCKS */}
      <h5>{Translator('T-UNIQ-FULL')}</h5>
      <Table bordered hover>
        <tbody>
          {Object.keys(priceTableUnique).map((item) => (
            <tr key={item}>
              <td style={{width: '50px'}}>
                <img src={clothingIcons.socks.icon} alt="icon" height={25} />
              </td>
              <td>
                <TableCellAsInput
                  value={
                    priceTableUnique.socks[0] > 0
                      ? priceTableUnique.socks[0]
                      : ''
                  }
                  handleBlur={({target}) => {
                    handleUpdatePriceTable('', 'socks', target.value, 0);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* POPUP TO CONFIRM CLEAR ORDER LIST FROM CLIENT AFTER SENT */}
      <ModalConfirmDialog
        isOpen={isModalConfirmOpen}
        title={Translator('CONFIRM')}
        textContent={Translator('ASK_CLEAR_ORDERLIST_AFTER_SENT')}
        handleHide={() => setIsModalConfirmOpen(false)}
        handleConfirm={() => {
          setIsModalConfirmOpen(false);
          generateLink(true);
        }}
        handleClose={() => {
          setIsModalConfirmOpen(false);
          generateLink(false);
        }}
      />

      {/* SHOW GENERATED LINK */}
      <div
        className={generatedLink !== '' ? 'd-flex' : 'd-none'}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <InputGroup className="mb-2">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faLink} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl className="text-center" defaultValue={generatedLink} />
          <InputGroup.Append>
            <CopyToClipboard text={generatedLink} onCopy={handleOnCopy}>
              <Button variant="secondary" size="sm">
                <FontAwesomeIcon icon={faCopy} />
                <span className="ml-1">{Translator('COPY_LINK')}</span>
              </Button>
            </CopyToClipboard>
          </InputGroup.Append>
        </InputGroup>
      </div>

      {/* TRIGGER LINK GENERATION */}
      <Row
        className="d-flex mt-2 mb-4"
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <Col xs={12} className="text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsModalConfirmOpen(true)}>
            <FontAwesomeIcon icon={faLink} />
            <span className="ml-1">{Translator('GENERATE_LINK')}</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default BussinessPricing;
