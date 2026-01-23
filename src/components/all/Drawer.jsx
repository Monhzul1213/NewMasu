import React, { useEffect, useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import '../../css/report.css';
import { Button, DynamicAIIcon, DynamicRIIcon, Money } from './';
import { domain, encrypt } from '../../helpers';
import { bonus, coupon } from '../../assets'
import { getService } from '../../services';
// import { InvoicePrint } from '../../../pages/lone/InvoicePrint';
// import { TaxPrint } from '../../../pages/lone/TaxPrint';
// import { TaxPrintA5 } from '../../../pages/lone/TaxPrintA5';

export function BillDrawer(props){
  const { selected, open, setOpen } = props;
  const { t } = useTranslation();
  const [pureAmount, setPureAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [header, setHeader] = useState(null);
  const [detail, setDetail] = useState(null);
  const [info, setInfo] = useState(null);
  const [account, setAccount] = useState([]);
  const [day, setDay] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();

  console.log(selected);
  
  useEffect(() => {
    if(selected){
      let pure = (selected?.sale?.totalSalesAmount ?? 0) -
        (selected?.sale?.totalVatAmount ?? 0) - (selected?.sale?.totalNhatamount ?? 0);
      setPureAmount(pure);
      setTotalAmount((selected?.sale?.totalCashAmount ?? 0) + (selected?.sale?.totalNonCashAmount ?? 0));
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onClose = () => setOpen(null);

  const renderItem = (item, index) => {
    let variant = item?.variantName ? (' (' + item?.variantName  + ')') : ''
    return (
      <div key={index} className='dr_item1'>
        <div key={index} className='dr_item_row'>
          <p className='dr_item_text1' title={item?.invtName ?? item?.invtId} aria-label={item?.invtName ?? item?.invtId}>{item?.invtName ?? item?.invtId}{variant}</p>
          <p className='dr_item_text2'>{item?.qty}</p>
          <p className='dr_item_text3'><Money value={item?.price}/></p>
          <p className='dr_item_text4'><Money value={item?.amount}/></p>
        </div>
        <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            {item?.couponAmount ? <img src={coupon} className='dr_img' alt='coupon'/> : ''}
            <p className='dr_item_text_z2'>{item?.couponName ? (item?.couponName) : ''}</p>
          </div>
          <p className='dr_item_text_z2'>{item?.couponAmount ? <Money value={item?.couponAmount}/> : ''}</p>
        </div>
        {item?.bonusID !== 0 && item?.bonusId ? 
          <div className='dr_item_text_back'>
            <div className='dr_img_back'>
              {<img src={bonus} className='dr_bonus_img' alt='coupon'/>}
              <p className='dr_item_text_z2'>{item?.bonusName}</p>
            </div>
            <p className='dr_item_text_z2'>{<Money value={item?.rewardAmount}/>}</p>
          </div> 
        : ''}
        <p className='dr_item_text'>{(item?.serviceCode !== 0 && item?.serviceCode !==null) ? ( t('report_receipt.t_emp')+ ': ' + item?.empName ) : ''}</p>
      </div>
    )
  }

  const renderItem1 = (item) => {
    return (
      <div className='dr_row_m'>
          <p className='dr_row_label_m'>{item?.paymentTypeName}</p>
          <p className='dr_row_value_m'><Money value={item?.paymentAmount} /></p>
      </div> 
    )
  }

  const Field = props => {
    const { icon, label, value } = props;
    
    return (
      <div className='dr_field'>
        <DynamicRIIcon className='dr_field_icon' name={icon} />
        <p className='dr_field_label'>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value'>{value}</p>
      </div>
    )
  }

  const Field1= props => {
    const {label, value } = props;
    
    return (
      <div className='dr_field'>
        <p className='dr_field_label' style={{width: 120}}>{t(label)}</p>
        <p className='dr_field_label1'>:</p>
        <p className='dr_field_value'>{value}</p>
      </div>
    )
  }

  const getData = async () => {
    setLoading(true);
    setError(null);
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo;
    let invoiceNo = encrypt(msg);
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
      setAccount(response?.data?.retdata?.invdtl);
      setDay(response?.data?.retdata?.inv?.[0]);
      setImage(response?.data?.retdata?.data);
    }
    setLoading(false);
  };
  const onClickLink = () => {
    let msg = selected?.sale?.merchantId + '-' + selected?.sale?.siteId + '-' + selected?.sale?.salesNo
    let code = encrypt(msg);
    let url = domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

const onClickInvoice = async() => {
  await getData();
  setVisible2(true);
}

const onClickTax = async() => {
  await getData();
  setVisible1(true);
}

const onClickPrintA4 = async () => {
  await getData();
  setVisible(true);
}

  const drawerProps = { className: selected?.sale?.consumerID && selected?.sale?.terminalD ? 'rp_drawer2' : 'rp_drawer1', placement: 'right', onClose, closable: false, open, mask: false };
  const visibleProps = { loading, error, header, account, detail, info, day, visible, visible1, visible2, setVisible, setVisible1, setVisible2, image}

  return (
    <AntDrawer {...drawerProps}>
      {/* {visible && !loading && <TaxPrint {...visibleProps}/>}
      {visible1 && !loading && <TaxPrintA5 {...visibleProps}/>}
      {visible2 && !loading && <InvoicePrint {...visibleProps}/>} */}
      <div className='dr_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <p className='dr_title'>{selected?.sale?.salesTypeName}</p>
        <Field icon='RiUserLine' label='report.empName' value={selected?.sale?.cashierName} />
        <Field icon='RiDeviceLine' label='report_receipt.pos' value={selected?.sale?.terminalDescr} />
        <Field icon='RiStore2Line' label='report_receipt.dr_site' value={selected?.sale?.siteName} />
        <div className='dr_field'>
          <DynamicRIIcon className='dr_field_icon' name={'RiBillLine'} />
          <p className='dr_field_label'>{t('report_receipt.dr_no')}</p>
          <p className='dr_field_label1'>:</p>
          <a className='table_link' onClick={onClickLink}>{selected?.sale?.salesNo}</a>
        </div>
        <Field icon='RiCalendarLine' label='system.date' value={moment(selected?.sale?.createdDate)?.format('yyyy.MM.DD HH:mm:ss')} />
        <Field icon='RiTeamLine' label='menu.customer' value={selected?.customer} /> 
        <div className='dr_header'>
          <p className='dr_header_text1'>{t('report_receipt.invt')}</p>
          <p className='dr_header_text2'>{t('report_receipt.qty')}</p>
          <p className='dr_header_text3'>{t('report_receipt.price')}</p>
          <p className='dr_header_text4'>{t('report_receipt.amt')}</p>
        </div>
        <div className='dr_list'>
          {selected?.saleitem?.map(renderItem)}
        </div>
        <div style={{padding: '5px 0 5px 0'}}>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.amt')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalAmount} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.discount')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalDiscountAmount} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.pay')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={selected?.sale?.totalSalesAmount} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.pure')}</p>
            <p className='dr_row_value'><Money value={pureAmount}/></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.nhat')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalNhatamount} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.vat')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalVatAmount} /></p>
          </div>
          <div className='dr_line' />
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.cash')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalCashAmount} /></p>
          </div>
          <div className='dr_row'>
            <p className='dr_row_label'>{t('report_receipt.non_cash')}</p>
            <p className='dr_row_value'><Money value={selected?.sale?.totalNonCashAmount}/></p>
          </div>
          {selected?.paymentitem?.map(renderItem1)}
          <div className='dr_row'>
            <p className='dr_row_label' style={{fontWeight: 'bold'}}>{t('report_receipt.paid')}</p>
            <p className='dr_row_value' style={{fontWeight: 'bold'}}><Money value={totalAmount} /></p>
          </div>
        </div>
        {selected?.sale?.consumerID && selected?.sale?.ticketBinID ? 
        <div style={{backgroundColor: '#f1f1f1', padding: '3px', borderRadius: 5, position: 'absolute', bottom: 60, left: 20, right: 20}}>
          <p style={{fontSize: 13, fontWeight: 'bold'}}>{t('coupon.consumer')}</p>
          <Field1 label={'menu.order'} value= {selected?.sale?.refNo + ' / ' + selected?.sale?.ticketBinName}/>
          <Field1 label={t('coupon.consumer')} value= {selected?.sale?.phone}/>
          <Field1 label={t('order.note')} value= {selected?.sale?.addDescr}/>
        </div> : null}
        <div className='dr_row_back'>
          <Button className='invoice_btn' id='invt_btn_save' text={t('system.print_a4')} onClick={onClickPrintA4} />
          <Button className='invoice_btn' id='invt_btn_save' text={t('system.tax_print')} onClick={onClickTax} />
          <Button className='invoice_btn' id='invt_btn_save' text={t('invoices.invoice1')} onClick={onClickInvoice} />  
        </div>
      </div>
    </AntDrawer>
  );
}