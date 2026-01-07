import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import '../../../css/bill.css';
import { Footer, Header, Info, Items, ItemsHeader, Total, InfoBank } from './invoiceComp';
import { getService } from '../../../services';
import { Overlay } from '../../all';

export function InvoicePreview(props){
  const {image64, date, accounts } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
  const [info, setInfo] = useState(null);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);
    setError(null);
    const invoiceNo = searchParams?.get('invoiceNo');
    const api = 'Sales/GetSalesBill?data=' + encodeURIComponent(invoiceNo);
    const response = await dispatch(getService(api, 'GET'));
    if (response?.error) {
      setError(response?.error);
    } else {
      const header = response?.data?.retdata?.sales?.[0];
      if (header) {
        header.pureAmount = (header.totalSalesAmount ?? 0) - (header.totalVatAmount ?? 0) - (header.totalNhatamount ?? 0);
      }
      setHeader(header);
      setDetail(response?.data?.retdata?.salesitem);
      setInfo(response?.data?.retdata?.bill);
    }
    setLoading(false);
  };

  return (
    <Overlay loading={loading}>
      <div style={{ display: "flex", width: "135mm", background: "white", padding: "5mm 6mm", minHeight: '180mm', boxShadow: '-4px 0 10px rgba(0, 0, 0, 0.20)', marginTop: 20 }}>
        <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
          <div>
            <Header header={header} image64={image64}/>
            <InfoBank header={header} endDate={date} accounts={accounts}/>
            <div className='iline'/>
            <Info header={header} error={error}/>
            <ItemsHeader />
            <Items detail={detail} />
            <Total header={header} />
          </div>
          <Footer info={info}/>
        </div>
      </div>
    </Overlay>
  );
}