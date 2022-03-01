import styled from 'styled-components';

export const TableRow = styled.tr`
  box-shadow: ${(props) =>
    props.isDragging ? '0px 0px 5px 1px #007bff' : 'none'};
`;

export const TableCell = styled.td`
  text-align: center;
`;
