import React from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import CopyToClipboard from 'react-copy-to-clipboard';

import { DynamicTBIcon, DynamicMDIcon, DynamicAIIcon } from './DynamicIcon';
import { Money } from './Money';

export function ModalTitle(props){
  const { icon, title, isMD, className } = props;

  const iconProps = { className: 'm_title_icon', name: icon };

  return (
    <div className='m_title_row'>
      {!icon ? null : isMD ? <DynamicMDIcon {...iconProps} /> : <DynamicTBIcon {...iconProps} />}
      <p className={className ? className : 'm_title'}>{title}</p>
    </div>
  );
}

export function BankField(props){
  const { label, value, copy, isBold } = props;

  const onCopy = () => toast.success('Copied to clipboard');

  return (
    <div className='pay_field_back' id='es_row'>
      <div style={{flex: 1}}>
        <p className='pay_field_label'>{label}</p>
        <p className='pay_field_value' style={{fontWeight: isBold ? '600' : '450', color: isBold ? 'var(--tag2-color)' : 'var(--text-color)'}}>{value}</p>
      </div>
      <CopyToClipboard text={copy ?? value} onCopy={onCopy}>
        <DynamicAIIcon name='AiOutlineCopy' className='pay_field_copy' />
      </CopyToClipboard>
    </div>
  );
}

export function ChartTab(props){
  const { label, value, tab, setTab, title } = props;
  const { t } = useTranslation();
  const style = label === tab ?  { borderColor: 'var(--tag2-color)' } : { };

  return (
    <div className='rr_card' style={style} onClick={() => setTab(label)}>
      <p className='rr_card_label'>{t('report.' + title + '_' + label)}</p>
      <div className='rr_card_value'><Money value={value} /></div>
    </div>
  );
}