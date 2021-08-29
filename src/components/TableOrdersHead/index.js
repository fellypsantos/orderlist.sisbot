import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faHandHoldingUsd,
  faEdit,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import {OrderListContext} from '../../contexts/OrderListContext';

export default function TableOrdersHead() {
  const {clothingIcons, screenshotMode, Translator, isCycling} = useContext(
    OrderListContext,
  );

  return (
    <thead>
      <tr className={!screenshotMode ? 'd-none' : ''}>
        <td colSpan={10} className="text-center">
          <strong>{Translator('MAIN_TITLE')}</strong>
        </td>
      </tr>
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

        {Object.keys(clothingIcons)
          .filter((key) => {
            // Always return no variant clothes
            if (clothingIcons[key].isCycling === undefined) return true;

            // Only return bike or normal clothes, never both;
            if (clothingIcons[key].isCycling !== isCycling) return false;

            return true;
          })
          .map((key) => (
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
}
