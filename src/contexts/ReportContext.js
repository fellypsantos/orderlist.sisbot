import React, {createContext, useState} from 'react';

export const ReportContext = createContext();

const ReportProvider = ({children}) => {
  const [modalEditHeaderOpen, setModalEditHeaderOpen] = useState(false);
  const [headerReportData, setHeaderReportData] = useState({
    clientName: '',
    responsableName: '',
    orderDate: null,
    deliveryDate: null,
  });

  const ContextValues = {
    modalEditHeaderOpen,
    setModalEditHeaderOpen,
    headerReportData,
    setHeaderReportData,
  };

  return (
    <ReportContext.Provider value={ContextValues}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
