import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

import { MoneyInput, Date, CheckBox, Time, ButtonRow } from '../../../all';
import { PriceModalSites } from './PriceModalSites';

export function PriceModalSales(props){
  const { visibleSales, closeSales, selected, data, setData } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [price, setPrice] = useState({ value: '' });
  const [date1, setDate1] = useState({ value: moment() });
  const [date2, setDate2] = useState({ value: moment() });
  const [useTime, setUseTime] = useState(false);
  const [beginTime, setBeginTime] = useState({ value: '' });
  const [endTime, setEndTime] = useState({ value: '' });

  useEffect(() => {
    setSites(data?.filter(d => d.checked)?.map(d => {
      d.checkedS = selected?.original?.siteId === d?.siteId;
      d.checkedSOrg = selected?.original?.siteId === d?.siteId;
      return d;
    }));
    setPrice({ value: selected?.original?.salesPrice ?? 0 });
    if(selected?.original?.salesBeginDate && selected?.original?.useSalesPrice === 'Y') setDate1({ value: moment(selected?.original?.salesBeginDate) });
    if(selected?.original?.salesEndDate && selected?.original?.useSalesPrice === 'Y') setDate2({ value: moment(selected?.original?.salesEndDate) });
    setUseTime(selected?.original?.salesTimeLimited === 'Y');
    if(selected?.original?.salesTimeLimited === 'Y') setBeginTime({ value: selected?.original?.salesBeginTime ?? '' });
    if(selected?.original?.salesTimeLimited === 'Y') setEndTime({ value: selected?.original?.salesEndTime ?? '' });
    return () => {};
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    let salesPrice = parseFloat(price?.value ? price?.value : 0);
    let salesBeginDate = date1?.value?.startOf('D')?.toISOString();
    let salesEndDate = date2?.value?.endOf('D')?.toISOString();
    let salesTimeLimited = useTime ? 'Y' : 'N';
    let salesBeginTime = useTime ? beginTime?.value : '00:00:00';
    let salesEndTime = useTime ? endTime?.value : '00:00:00';
    let salesLabel = ' (' + moment(date1?.value).format('MM.DD') + '-' + moment(date2?.value).format('MM.DD');
    if(useTime) salesLabel += ' ' + salesBeginTime?.slice(0, 5) + '-' + salesEndTime?.slice(0, 5);
    salesLabel += ')';
    let timeValid = !useTime || (useTime && beginTime?.value && endTime?.value);
    let dateValid = checkDate(date1, date2);
    if(timeValid && salesPrice && dateValid){
      setData(sites?.map(s => {
        if(s?.checkedS)
          return {...s, useSalesPrice: 'Y', salesPrice, salesBeginDate, salesEndDate, salesTimeLimited, salesBeginTime, salesEndTime, salesLabel };
        else
          return s;
      }));
      closeSales();
    } else {
      if(!timeValid && !beginTime?.value) setBeginTime({ value: '', error: t('error.not_empty') });
      if(!timeValid && !endTime?.value) setEndTime({ value: '', error: t('error.not_empty') });
      if(!salesPrice) setPrice({...price, error: t('error.not_empty') })
    }
  }

  const onChangeDate1 = value => {
    setDate1(value);
    checkDate(value, date2);
  }

  const onChangeDate2 = value => {
    setDate2(value);
    checkDate(date1, value);
  }

  const checkDate = (d1, d2) => {
    let dt1 = moment(d1?.value?.format('yyyy.MM.DD'), 'yyyy.MM.DD');
    let dt2 = moment(d2?.value?.format('yyyy.MM.DD'), 'yyyy.MM.DD');
    let diff = dt2.diff(dt1, 'days');
    if(diff < 0){
      setDate2({ value: d2?.value, error: t('error.date_early') });
      return false;
    } else
      return true;
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visibleSales} centered={true} width={400}>
      <div className='m_back'>
        <p className='m_title'>{t('inventory.t_salesprice')}</p>
        <div className='m_scroll'>
          <form onSubmit={onClickSave}>
            <MoneyInput
              value={price}
              setValue={setPrice}
              label={t('inventory.price')}
              placeholder={t('inventory.price')} />
            <div className='ac_row' style={{marginTop: 20}}>
              <Date value={date1} setValue={onChangeDate1} label={t('inventory.date1')} inRow={true} />
              <div className='gap' />
              <Date value={date2} setValue={onChangeDate2} label={t('inventory.date2')} inRow={true} />
            </div>
            <CheckBox checked={useTime} setChecked={setUseTime} label={t('inventory.use')} style={{ marginTop: 20 }} />
            {useTime && <div className='ac_row' style={{marginTop: 5}}>
              <Time value={beginTime} setValue={setBeginTime} label={t('inventory.time1')} inRow={true} />
              <div className='gap' />
              <Time value={endTime} setValue={setEndTime} label={t('inventory.time2')} inRow={true} />
            </div>}
            <PriceModalSites data={sites} setData={setSites} />
            <div style={{padding: 1}} />
          </form>
        </div>
      </div>
      <ButtonRow
        onClickCancel={closeSales}
        onClickSave={onClickSave}
        type='submit'
        isModal={true} />
    </Modal>
  );
}