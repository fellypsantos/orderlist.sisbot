import React, {createContext, useState} from 'react';

export const ReportContext = createContext();

const ReportProvider = ({children}) => {
  const [modalImageSelection, setModalVisibleImageSelection] = useState(false);
  const [modalEditHeaderOpen, setModalEditHeaderOpen] = useState(false);
  const [headerReportData, setHeaderReportData] = useState({
    clientName: '',
    responsableName: '',
    orderDate: null,
    deliveryDate: null,
  });

  const ContextValues = {
    modalImageSelection,
    setModalVisibleImageSelection,
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
