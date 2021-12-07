import React, {createContext, useState} from 'react';

export const ReportContext = createContext();

const ReportProvider = ({children}) => {
  const [modalImageSelection, setModalVisibleImageSelection] = useState(false);

  const ContextValues = {
    modalImageSelection,
    setModalVisibleImageSelection,
  };

  return (
    <ReportContext.Provider value={ContextValues}>
      {children}
    </ReportContext.Provider>
  );
};

export default ReportProvider;
