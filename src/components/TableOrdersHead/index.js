import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faHandHoldingUsd,
  faEdit,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';
import ButtonDeleteSelectedItems from '../ButtonDeleteSelectedItems';

const TableOrdersHead = () => {
  const {clothingIcons, screenshotMode, Translator, isCycling, orderListItems} =
    useContext(OrderListContext);

  const [totalOfPieces, setTotalOfPieces] = useState(0);

  useEffect(() => {
    const calculated = Utils.HelperCountTotalOfPieces(orderListItems, true);
    setTotalOfPieces(calculated);
  }, [orderListItems]);

  return (
    <thead>
      {/* NORMAL MODE */}
      <tr className={screenshotMode ? 'd-none' : ''}>
        <td
          className="text-center"
          colSpan={Utils.GetTotalColumnsTableOrderListItems(
            document.getElementById('tableOrderListItems'),
          )}>
          {`${Translator('CONTAINS_N_UNITS')} ${totalOfPieces}`}
        </td>
      </tr>

      {/* SCREENSHOT MODE */}
      <tr className={!screenshotMode ? 'd-none' : ''}>
        <td colSpan={11} className="text-center">
          <strong>
            {Translator('MAIN_TITLE')} -{' '}
            {`${Translator('CONTAINS_N_UNITS')} ${totalOfPieces}`}
          </strong>
        </td>
      </tr>

      <ButtonDeleteSelectedItems />

      <tr className="text-center">
        <th style={{maxWidth: '50px'}}>
          {screenshotMode ? (
            Translator('PAID')
          ) : (
            <FontAwesomeIcon icon={faHandHoldingUsd} />
          )}
        </th>
        <th className="text-left">{Translator('NAME')}</th>
        <th>{Translator('NUMBER')}</th>

        {Utils.FilterClothesByMode(clothingIcons, isCycling).map((key) => (
          <th
            key={key}
            className={`${!screenshotMode ? 'd-none d-md-table-cell' : ''}`}>
            <img src={clothingIcons[key].icon} alt="icon" height={25} />
          </th>
        ))}

        <th>
          {screenshotMode ? (
            Translator('PRICE')
          ) : (
            <FontAwesomeIcon icon={faCoins} />
          )}
        </th>
        <th className="d-table-cell d-md-none">
          <FontAwesomeIcon icon={faEye} />
        </th>

        <th className={screenshotMode ? 'd-none' : 'd-none d-md-table-cell'}>
          <FontAwesomeIcon icon={faEdit} />
        </th>
        <th className={screenshotMode ? 'd-none' : 'd-none d-md-table-cell'}>
          <FontAwesomeIcon icon={faTrash} />
        </th>
      </tr>
    </thead>
  );
};

export default TableOrdersHead;
