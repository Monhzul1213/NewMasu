import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { ButtonRow, Input } from '../../../all';
import { PriceModalSites } from './PriceModalSites';

export function PriceModalSafe(props){
  const { visibleSafe, closeSafe, selected, data, setData } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [qty, setQty] = useState({ value: '' });

  useEffect(() => {
    setSites(data?.filter(d => d.checked)?.map(d => {
      d.checkedS = selected?.original?.siteId === d?.siteId;
      d.checkedSOrg = selected?.original?.siteId === d?.siteId;
      return d;
    }));
    setQty({ value: selected?.original?.minQty ?? 0 });
    return () => {};
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    let minQty = parseFloat(qty?.value ? qty?.value : 0);
    if(minQty){
      setData(sites?.map(s => {
        if(s?.checkedS) return {...s, useMinQty: 'Y', minQty };
        else return s;
      }));
      closeSafe();
    } else {
      if(!minQty) setQty({...qty, error: t('error.not_empty') })
    }
  }

  const onChangeQty = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setQty({...value, error: 'must_number'});
    else setQty({ value: text });
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visibleSafe} centered={true} width={400}>
      <div className='m_back'>
        <p className='m_title'>{t('inventory.safeQty')}</p>
        <div className='m_scroll'>
          <form onSubmit={onClickSave}>
            <Input
              value={qty}
              setValue={onChangeQty}
              label={t('inventory.t_qty')}
              placeholder={t('inventory.t_qty')} />
            <PriceModalSites data={sites} setData={setSites} />
            <div style={{padding: 1}} />
          </form>
        </div>
      </div>
      <ButtonRow
        onClickCancel={closeSafe}
        onClickSave={onClickSave}
        type='submit'
        isModal={true} />
    </Modal>
  );
}