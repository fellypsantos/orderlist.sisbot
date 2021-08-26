import styled from 'styled-components';

export const CustomInputAsHeaderText = styled.input`
  border: 1px solid transparent;
  color: #222;
  margin-bottom: 14px;
  font-weight: 500;
  line-height: 1.2;
  font-size: 1.5rem;
  max-width: 300px;
  outline: none;

  :hover,
  :focus {
    border-bottom: 1px dashed #666;
    padding-bottom: 2px;
  }
`;
