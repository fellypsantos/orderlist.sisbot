import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TableCell, TableRow} from './styles';

const TableOrdersBody = () => (
  <tbody>
    <TableRow>
      <TableCell>
        <input type="checkbox" />
      </TableCell>
      <TableCell>Fellyp</TableCell>
      <TableCell>256</TableCell>
      <TableCell className="d-none d-md-table-cell">1-M</TableCell>
      <TableCell className="d-none d-md-table-cell">-</TableCell>
      <TableCell className="d-none d-md-table-cell">1-M</TableCell>
      <TableCell className="d-none d-md-table-cell">-</TableCell>
      <TableCell className="d-none d-md-table-cell">-</TableCell>
      <TableCell className="d-none d-md-table-cell">-</TableCell>
      <TableCell>$ 75</TableCell>
      <TableCell>
        <FontAwesomeIcon icon={faEdit} />
      </TableCell>
      <TableCell>
        <FontAwesomeIcon icon={faTrash} />
      </TableCell>
    </TableRow>
  </tbody>
);

export default TableOrdersBody;
