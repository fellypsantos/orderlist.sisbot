import React, {useContext} from 'react';
import {CompanyName, ReportDate, SubTitle, Divider} from './styles';

import {OrderListContext} from '../../contexts/OrderListContext';

const ReportHeader = ({subtitle, date}) => {
  const {Translator, companyName, setCompanyName} =
    useContext(OrderListContext);

  return (
    <>
      <CompanyName
        value={companyName}
        placeholder={Translator('COMPANY_NAME')}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <SubTitle>{subtitle}</SubTitle>
      <Divider />
      <ReportDate>{date}</ReportDate>
    </>
  );
};

export default ReportHeader;
