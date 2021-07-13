import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TableCell, TableRow} from './styles';
import {OrderListContext} from '../../contexts/OrderListContext';
import ModalConfirmDialog from '../ModalConfirmDialog';

const TableOrdersBody = () => {
  const {orderListItems, setOrderListItems, Translator} = useContext(
    OrderListContext,
  );

  const [confirmDeleteItem, setConfirmDeleteItem] = useState({});

  const isEmptyClothe = (clothe) =>
    clothe.size === '' || clothe.quantity === '';

  const handleChange = (e, itemID) => {
    // ATUALIZAR O STATUS DO PAGAMENTO DO USUÁRIO PELO id
    const {checked} = e.target;
    const updatedOrderListItems = orderListItems.map((orderItem) => {
      if (orderItem.id === itemID) {
        // UPDATE PAYMENT
        return {
          ...orderItem,
          payment: {
            ...orderItem.payment,
            paid: checked,
          },
        };
      }
      return orderItem;
    });

    setOrderListItems(updatedOrderListItems);
  };

  const handleDelete = (itemID, confirmed = false) => {
    console.log('confirmed', confirmed);
    if (!confirmed) {
      setConfirmDeleteItem({
        isOpen: true,
        itemID,
      });

      return;
    }

    // USER CONFIRMED! DELETE
    const updatedOrderListItems = orderListItems.filter(
      (orderItem) => orderItem.id !== itemID,
    );

    setOrderListItems(updatedOrderListItems);

    setConfirmDeleteItem({
      isOpen: false,
      itemID: null,
    });
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDeleteItem({
      ...confirmDeleteItem,
      isOpen: false,
    });
  };

  return (
    <>
      {/* CONFIRM DELETE ITEM FROM LIST */}
      <ModalConfirmDialog
        isOpen={confirmDeleteItem.isOpen}
        title="Lista de Pedidos"
        textContent="Deseja mesmo excluir o item selecionado?"
        handleConfirm={() => handleDelete(confirmDeleteItem.itemID, true)}
        handleClose={handleCloseDeleteDialog}
      />

      <tbody>
        {orderListItems.length > 0 ? (
          orderListItems.map((item) => (
            <TableRow key={item.id} className={item.payment.paid && 'paid'}>
              <TableCell>
                <input
                  type="checkbox"
                  checked={item.payment.paid}
                  onChange={(e) => handleChange(e, item.id)}
                />
              </TableCell>
              <TableCell className="text-left">{item.name}</TableCell>
              <TableCell>{item.number}</TableCell>
              {item.clothingSettings.map((clothe) => (
                <TableCell key={clothe.id} className="d-none d-md-table-cell">
                  {isEmptyClothe(clothe)
                    ? '-'
                    : `${clothe.quantity}-${Translator(clothe.size)}`}
                </TableCell>
              ))}
              <TableCell>$ {item.payment.value}</TableCell>
              <TableCell>
                <a href="#!">
                  <FontAwesomeIcon icon={faEdit} />
                </a>
              </TableCell>
              <TableCell>
                <a
                  href="#!"
                  className="color-flat-red"
                  onClick={() => handleDelete(item.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </a>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={12}>Nenhum item até o momento.</TableCell>
          </TableRow>
        )}
      </tbody>
    </>
  );
};

export default TableOrdersBody;
