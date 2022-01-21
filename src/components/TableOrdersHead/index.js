import React, {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faHandHoldingUsd,
  faEdit,
  faTrash,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import {OrderListContext} from '../../contexts/OrderListContext';
import Utils from '../../Utils';

const TableOrdersHead = () => {
  const {
    clothingIcons,
    screenshotMode,
    Translator,
    isCycling,
    orderListItems,
    setOrderListItems,
    paidOrderItems,
    setPaidOrderItems,
  } = useContext(OrderListContext);

  const [totalOfPieces, setTotalOfPieces] = useState(0);

  const handleDeleteSelectedItems = () => {
    const confirm = window.confirm(
      'Deseja remover todos os itens selecionados na lista? Não é possível desfazer.',
    );
    if (confirm) {
      const newListData = orderListItems.filter((orderItem) => {
        const indexToDelete = paidOrderItems.findIndex(
          (index) => orderItem.id === index,
        );
        if (indexToDelete > -1) return false;
        return true;
      });

      // UPDATE GLOBAL LIST
      setPaidOrderItems([]);
      setOrderListItems(newListData);
    }
  };

  const ButtonDeleteSelectedItems = () => (
    <tr
      className={screenshotMode || paidOrderItems.length === 0 ? 'd-none' : ''}>
      <td colSpan={12} className="text-right">
        <Button variant="danger" size="sm" onClick={handleDeleteSelectedItems}>
          <FontAwesomeIcon icon={faTrash} />
          <span className="ml-1 d-none d-md-inline-block">
            Excluir Selecionados
          </span>
        </Button>
      </td>
    </tr>
  );

  useEffect(() => {
    const calculated = Utils.HelperCountTotalOfPieces(orderListItems, true);
    setTotalOfPieces(calculated);
  }, [orderListItems]);

  console.log('->', paidOrderItems.length);

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
        <td colSpan={10} className="text-center">
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
