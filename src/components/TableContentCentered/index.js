import React from 'react';

import {TableCustom} from './styles';

const TableContentCentered = ({children}) => (
  <TableCustom bordered hover>
    {children}
  </TableCustom>
);

export default TableContentCentered;
