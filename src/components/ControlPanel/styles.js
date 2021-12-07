import styled from 'styled-components';

export const Container = styled.div``;

export const ToggleViewContainer = styled.div`
  background-color: #dedede;
  height: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToggleViewButton = styled.button`
  border: none;
  background-color: #dedede;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  transition: all 0.5s;
  color: #bbb;

  &:hover {
    background-color: #28a745;
    color: #fff;
  }
`;
