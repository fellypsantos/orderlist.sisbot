import React, {useContext} from 'react';
import Button from 'react-bootstrap/Button';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {useToasts} from 'react-toast-notifications';
import {OrderListContext} from '../../contexts/OrderListContext';
import ModalConfirmDialog from '../ModalConfirmDialog';

const ButtonDeleteSelectedItems = () => {
  const {
    orderListItems,
    paidOrderItems,
    setOrderListItems,
    setPaidOrderItems,
    screenshotMode,
    modalDeleteSelectedOpen,
    setModalDeleteSelectedOpen,
    Translator,
  } = useContext(OrderListContext);

  const {addToast} = useToasts();

  const handleConfirmDelete = () => {
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
    setModalDeleteSelectedOpen(false);

    addToast(Translator('TOAST_SELECTED_ITEMS_DELETED'), {
      appearance: 'success',
      autoDismiss: true,
    });
  };

  return (
    <>
      <ModalConfirmDialog
        isOpen={modalDeleteSelectedOpen}
        useDangerConfirm
        title={Translator('WARNING')}
        textContent={Translator('CONFIRM_DELETE_SELECTED_ITEMS')}
        handleConfirm={handleConfirmDelete}
        handleClose={() => setModalDeleteSelectedOpen(false)}
      />

      <tr
        className={
          screenshotMode || paidOrderItems.length === 0 ? 'd-none' : ''
        }>
        <td colSpan={12} className="text-right">
          <Button
            variant="danger"
            size="sm"
            onClick={() => setModalDeleteSelectedOpen(true)}>
            <FontAwesomeIcon icon={faTrash} />
            <span className="ml-1 d-none d-md-inline-block">
              {Translator('DELETE_SELECTED')}
            </span>
          </Button>
        </td>
      </tr>
    </>
  );
};

export default ButtonDeleteSelectedItems;
