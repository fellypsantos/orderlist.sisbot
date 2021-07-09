import styled from 'styled-components';
import '../../../node_modules/@fortawesome/free-solid-svg-icons';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

export const DropdownContainer = styled.div`
  position: relative;
  z-index: 1000;

  span#language-dropdown-label::after {
    content: ' ${(props) => (props.isOpen ? ' ▴' : ' ▾')}';
  }
`;

export const DropdownContent = styled.ul`
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: absolute;
  top: 0;
  right: 0;
  padding: 0px;
  list-style: none;
  margin-top: 2.5rem;
  min-width: 10rem;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  overflow: hidden;
`;

export const DropdownContentItem = styled.li`
  cursor: pointer;
  display: block;
  padding: 0.5rem 1.5rem;
  clear: both;
  white-space: nowrap;
  border: 0;
  user-select: none;

  &:hover {
    background-color: #e7ebef;
  }

  &:active {
    background-color: #007bff;
  }

  > span:first-child {
    margin-right: 5px;
  }
`;
