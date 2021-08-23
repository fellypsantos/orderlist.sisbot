import React, {useEffect, useState, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {faDownload} from '@fortawesome/free-solid-svg-icons';

import Title from '../../components/Title';
import TableCellAsInput from '../../components/TableCellAsInput';
import {OrderListContext} from '../../contexts/OrderListContext';

const BussinessPricing = () => {
  const {clothingIcons, clothingSizes, Translator} = useContext(
    OrderListContext,
  );

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

  const handleUpdatePriceTable = (
    thePriceTableID,
    theClotheName,
    newPrice,
    indexPrice,
  ) => {
    console.log(thePriceTableID, theClotheName, newPrice, indexPrice);

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
      // console.log(item, index, newPrice);

      if (index === indexPrice) {
        return parseInt(newPrice.replace('$ ', '')) || 0;
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
  };

  return (
    <div>
      <div
        className="d-flex"
        style={{justifyContent: 'space-between', alignItems: 'center'}}>
        <Title text="Tabela de Preços" />
        <div>
          <Button variant="secondary" size="sm" onClick={() => null}>
            <FontAwesomeIcon icon={faDownload} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DOWNLOAD')}
            </span>
          </Button>
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
              {clothingIcons.map((theIcon) => (
                <tr className="text-center" key={theIcon.id}>
                  <td>
                    <img src={theIcon.icon} alt="icon" height={25} />
                  </td>
                  {clothingSizes.map((theSize, index) => {
                    if (theSize.target === 'TEEN') return false;
                    return (
                      <td key={theSize.id}>
                        <TableCellAsInput
                          value={priceTableMale[theIcon.name][index]}
                          handleBlur={({target}) => {
                            handleUpdatePriceTable(
                              'MALE',
                              theIcon.name,
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
              {clothingIcons.map((theIcon) => (
                <tr className="text-center" key={theIcon.id}>
                  <td>
                    <img src={theIcon.icon} alt="icon" height={25} />
                  </td>
                  {clothingSizes.map((theSize, index) => {
                    if (theSize.target === 'TEEN') return false;

                    return (
                      <td key={theSize.id}>
                        <TableCellAsInput
                          value={priceTableFemale[theIcon.name][index]}
                          handleBlur={({target}) => {
                            handleUpdatePriceTable(
                              'FEMALE',
                              theIcon.name,
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
              {clothingIcons.map((theIcon) => (
                <tr className="text-center" key={theIcon.id}>
                  <td>
                    <img src={theIcon.icon} alt="icon" height={25} />
                  </td>
                  {clothingSizes.map((theSize, index) => {
                    if (theSize.target === 'ADULT') return false;
                    // TEENS START IN HIGHER INDEX ON LIST, SUBTRACT TO CONSIDER ZERO
                    const customIndex = index - 9;

                    return (
                      <td key={theSize.id}>
                        <TableCellAsInput
                          value={priceTableChildish[theIcon.name][customIndex]}
                          handleBlur={({target}) => {
                            handleUpdatePriceTable(
                              'CHILDISH',
                              theIcon.name,
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
