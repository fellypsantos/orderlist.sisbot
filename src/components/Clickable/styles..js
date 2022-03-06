import styled from 'styled-components';

export const ItemToClick = styled.button`
  border: none;
  padding: 0px;
  background-color: transparent;
  color: ${(props) => (props.disabled ? '#aaa' : '#007bff')};
`;
