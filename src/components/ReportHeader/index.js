import React from 'react';
import {ReportDate, SubTitle, Title, Divider} from './styles';

const ReportHeader = ({title, subtitle, date}) => (
  <>
    <Title>{title}</Title>
    <SubTitle>{subtitle}</SubTitle>
    <Divider />
    <ReportDate>{date}</ReportDate>
  </>
);

export default ReportHeader;
