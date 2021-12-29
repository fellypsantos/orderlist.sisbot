import {createGlobalStyle} from 'styled-components';

const GlobalStyle = createGlobalStyle`
  .react-toast-notifications__container {
    z-index: 1100 !important;
    top: 32px !important;
  }

  .color-flat-red {
    color: #f03434 !important;
  }

  .paid {
    background-color: #c9f5d4 !important
  }

  @media print {
    .hide-on-print {
      display: none;
    }
  }
`;

export default GlobalStyle;
