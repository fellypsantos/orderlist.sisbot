import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDollarSign} from '@fortawesome/free-solid-svg-icons';
import Utils from '../../Utils';
import {OrderListContext} from '../../contexts/OrderListContext';

export default function TableOrdersHead() {
  const context = useContext(OrderListContext);
  const {clothingIcons} = context;

  return (
    <thead>
      <tr style={Utils.StyleHelper.TextAlign('center')}>
        <th style={{maxWidth: '50px'}}>
          <FontAwesomeIcon icon={faDollarSign} />
        </th>
        <th style={Utils.StyleHelper.TextAlign('left')}>Nome</th>
        <th>Número</th>

        {clothingIcons.map((clothingIcon) => (
          <th key={clothingIcon.id} className="d-none d-md-table-cell">
            <img src={clothingIcon.icon} alt="icon" height={25} />
          </th>
        ))}
        <th>$$</th>
        <th>-</th>
        <th>-</th>
      </tr>
    </thead>
  );
}
