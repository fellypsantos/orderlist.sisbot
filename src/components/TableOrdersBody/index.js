import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TableCell, TableRow} from './styles';
import {OrderListContext} from '../../contexts/OrderListContext';

const TableOrdersBody = () => {
  const {orderListItems, setOrderListItems, Translator} = useContext(
    OrderListContext,
  );

  const isEmptyClothe = (clothe) =>
    clothe.size === '' || clothe.quantity === '';

  const handleChange = (e, itemID) => {
    // ATUALIZAR O STATUS DO PAGAMENTO DO USUÁRIO PELO id
    const {checked} = e.target;

    console.log('new value: ', checked);

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

  return (
    <tbody>
      {orderListItems.length > 0 ? (
        orderListItems.map((item) => (
          <TableRow key={item.id}>
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
              <a href="#!" className="color-flat-green">
                <FontAwesomeIcon icon={faEdit} />
              </a>
            </TableCell>
            <TableCell>
              <a href="#!" className="color-flat-red">
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
  );
};

export default TableOrdersBody;
