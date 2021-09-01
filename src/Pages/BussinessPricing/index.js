import React, {useEffect, useState, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useHistory} from 'react-router-dom';
import hash from 'object-hash';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {
  faArrowLeft,
  faDownload,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';

import TableCellAsInput from '../../components/TableCellAsInput';
import {OrderListContext} from '../../contexts/OrderListContext';
import {CustomInputAsHeaderText} from './styles';
import Utils from '../../Utils';
import ButtonToggleClothignIcons from '../../components/ButtonToggleClothingIcons';

const LS_PRICES_ID = 'sisbot.bussiness.prices';

const BussinessPricing = () => {
  const {
    clothingIcons,
    clothingSizes,
    Translator,
    isCycling,
    setCurrentClothingPrices,
    orderListItems,
    setOrderListItems,
    settings,
  } = useContext(OrderListContext);

  const [projectName, setProjectName] = useState('');
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

  const {addToast} = useToasts();

  const saveToLocalStorage = (paraProjectName = '') => {
    // SETTING DEFAULT EMPTY DATA
    localStorage.setItem(
      LS_PRICES_ID,
      JSON.stringify({
        projectName: paraProjectName,
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
      }),
    );
  };

  // LOAD DATA FROM LOCALSTORAGE
  useEffect(() => {
    const localStorageBussinessPrices = localStorage.getItem(LS_PRICES_ID);

    if (localStorageBussinessPrices !== null) {
      // ALREADY EXISTS DATA
      console.log('ALREADY EXISTS DATA, RESTORE IT');
      const data = JSON.parse(localStorageBussinessPrices);

      // RESTORE PROJECT NAME
      setProjectName(data.projectName);

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
    } else {
      // DEFAULT DATA
      saveToLocalStorage();
      console.log('EMPTY DATA SETTED');
    }
  }, []);

  // SAVE CHANGES TO LOCALSTORAGE
  useEffect(() => {
    saveToLocalStorage(projectName);

    // UPDATE CONTEXT TO REFLECT CHANGES IN MAIN PAGE PRICES
    setCurrentClothingPrices({
      projectName,
      priceTableMale,
      priceTableFemale,
      priceTableChildish,
    });

    console.log('setCurrentClothingPrices UPDATED');

    // FORCE RE-RENDER TABLE TO UPDATE TOTAL PRICE OF EACH ROW
    console.log('orderListItems', orderListItems);
    setOrderListItems([...orderListItems]);
    console.log('FORCED RE-RENDER TABLE');
  }, [projectName, priceTableMale, priceTableFemale, priceTableChildish]);

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
    }

    const updated = selectedPriceTable[theClotheName].map((item, index) => {
      if (index === indexPrice) {
        return parseInt(newPrice.replace(settings.coinPrefix, '')) || 0;
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
    }

    setCurrentClothingPrices({
      projectName,
      priceTableMale,
      priceTableFemale,
      priceTableChildish,
    });
  };

  const isValidJsonFileForPrices = (object) => {
    if (
      object.projectName !== undefined &&
      object.priceTableMale !== undefined &&
      object.priceTableFemale !== undefined &&
      object.priceTableChildish !== undefined
    ) {
      return true;
    }

    return false;
  };

  const handleUploadPricesTables = () => {
    Utils.HandleUploadFile('.json', (content) => {
      const uploaded = JSON.parse(content);
      if (isValidJsonFileForPrices(uploaded)) {
        setProjectName(uploaded.projectName);
        setPriceTableMale(uploaded.priceTableMale);
        setPriceTableFemale(uploaded.priceTableFemale);
        setPriceTableChildish(uploaded.priceTableChildish);

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
        priceTableMale,
        priceTableFemale,
        priceTableChildish,
      }),
    );

    const anchor = document.createElement('a');
    anchor.setAttribute('href', `data:text/plain;charset=utf-8,${jsonContent}`);
    anchor.setAttribute('download', `${projectName || 'Untitled'}.json`);
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

  return (
    <div>
      <div
        className="d-flex"
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <CustomInputAsHeaderText
          type="text"
          value={projectName}
          placeholder="Orçamento sem título"
          onChange={handleChangeFileNameToExport}
        />

        <div>
          {/* BACK */}
          <Button
            className="mr-2"
            variant="secondary"
            size="sm"
            onClick={() => history.goBack()}>
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
        </div>
      </div>

      <Tabs className="mb-3">
        {/* MALE */}
        <Tab eventKey="tabMale" title="Masculino">
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes.map((theSize) => {
                  if (theSize.target === 'TEEN') return false;
                  return <th key={theSize.id}>{Translator(theSize.code)}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
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
                    {clothingSizes.map((theSize, index) => {
                      if (theSize.target === 'TEEN') return false;
                      const genericKey = key.replace('Cycling', '');
                      const itemPrice = priceTableMale[genericKey][index];

                      return (
                        <td key={theSize.id}>
                          <TableCellAsInput
                            value={itemPrice > 0 ? itemPrice : ''}
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
        <Tab eventKey="tabFemale" title="Feminino">
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes.map((theSize) => {
                  if (theSize.target === 'TEEN') return false;
                  return <th key={theSize.id}>{Translator(theSize.code)}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
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
                    {clothingSizes.map((theSize, index) => {
                      if (theSize.target === 'TEEN') return false;
                      const genericKey = key.replace('Cycling', '');
                      const itemPrice = priceTableFemale[genericKey][index];

                      return (
                        <td key={theSize.id}>
                          <TableCellAsInput
                            value={itemPrice > 0 ? itemPrice : ''}
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
        <Tab eventKey="tabChildish" title="Infantil">
          <Table bordered hover>
            <thead>
              <tr className="text-center">
                <th style={{width: '50px'}}>-</th>
                {clothingSizes.map((theSize) => {
                  if (theSize.target === 'ADULT') return false;

                  return <th key={theSize.id}>{Translator(theSize.code)}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {/* DRAW ROWS */}
              {Object.keys(clothingIcons)
                .filter((key) => {
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
                    {clothingSizes.map((theSize, index) => {
                      if (theSize.target === 'ADULT') return false;
                      // TEENS START IN HIGHER INDEX ON LIST, SUBTRACT TO CONSIDER ZERO
                      const genericKey = key.replace('Cycling', '');
                      const customIndex = index - 9;
                      const itemPrice =
                        priceTableChildish[genericKey][customIndex];

                      return (
                        <td key={theSize.id}>
                          <TableCellAsInput
                            value={itemPrice > 0 ? itemPrice : ''}
                            handleBlur={({target}) => {
                              handleUpdatePriceTable(
                                'CHILDISH',
                                genericKey,
                                target.value,
                                customIndex,
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
    </div>
  );
};

export default BussinessPricing;
