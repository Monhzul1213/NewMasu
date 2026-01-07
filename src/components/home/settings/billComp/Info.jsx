import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { DynamicMDIcon } from '../../../all';

const LabelIcon = props => {
  const { icon, value } = props;

  return (
    <div className='bl_icon_row'>
      <DynamicMDIcon name={icon} className='bl_icon' />
      <p className='bl_icon_value'>{value}</p>
    </div>
  );
}

const Label = props => {
  const { label, value, width } = props;

  return value ? (
    <div className='bl_row' style={{width}}>
      <p className='bl_label' style={{fontSize: 'var(--item-font)', width: 55}}>{label}: </p>
      <p className='bl_value' style={{fontSize: 'var(--item-font)'}}>{value}</p>
    </div>
  ) : null;
}

export function Info(props){
  const { header, image64, bill, options } = props;
  const { t } = useTranslation();
  const isRefund = header?.salesType === 1;
  const date = moment(header?.salesDate).format('yyyy.MM.DD');

  return (
    <div>
      {bill?.header ? <p className='bl_title'>{bill?.header}</p> : null}
      {image64 ? <img className='bl_image' src={image64} alt={t('bill.logo')}  /> : null}
      {header?.refNo ? <p className='bl_title'>{t('payment.order_number')}: {header?.refNo}</p> : ""}
      <p className='bl_title'>{t(isRefund ? 'bill.refund' : header?.holdDescr === 'EAT IN' ? 'bill.sales1' : header?.holdDescr === 'TAKE OUT' ? 'bill.sales2' : 'bill.sales')}</p>
      <div className='bl_row'>
        <LabelIcon icon='MdPersonOutline' value={header?.cashierName ?? header?.cashierCode ?? 'Bold'} />
        <LabelIcon icon='MdStayCurrentPortrait' value={header?.terminalName ?? header?.terminalD ?? 'Pos2'} space={true}/>
      </div>
      <div className="bl_row2col">
        <div className="bl_col">
          <Label label={t('ТТД')} value={header?.tinId ?? '5987444444444'} />
        </div>
        {options?.reg ? <div className="bl_col">
          <Label label={t('Регистер')} value={header?.vatPayerNo ?? '57856666'} />
        </div> : null}
      </div>
      <div className="bl_row2col">
        <div className="bl_col">
          <Label label={t('bill.site')} value={header?.siteName ?? 'Twin Tower II'} />
        </div>
        <div className="bl_col">
          <Label label={t('bill.receipt_no')} value={header?.salesNo ?? '2029029292002'} />
        </div>
      </div>
      {options?.address ? <div className='bl_row2col'>
        <Label label={t('bill.address')} value={header?.address ?? 'СБД 2-р хороо'} />
      </div> : null}
      <div className="bl_row2col">
        {options?.phone ? <div className="bl_col">
          <Label label={t('bill.phone')} value={header?.phone ?? '77092288'} />
        </div> : null}
        <div className="bl_col">
          <Label label={t('bill.date')} value={date} />
        </div>
      </div>
      {options?.descr ? <Label label={t('customer.descr')} value={'Тайлбар нэмж хэвлэх'} /> : null}
      {isRefund ? <Label label={t('bill.refund')} value={'#' + header?.sourceNo} /> : null}
      {header?.custId ? <Label label={t('bill.customer')} value={(header?.custName ?? '') + ' - ' + (header?.custPhone ?? '')} /> : null}
      <div className='bl_gap' />
    </div>
  );
}