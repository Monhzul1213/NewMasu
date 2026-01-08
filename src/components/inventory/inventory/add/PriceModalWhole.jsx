import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

import { ButtonRow, Input, MoneyInput } from "../../../all";
import { PriceModalSites } from "./PriceModalSites";

export function PriceModalWhole(props){
  const { visibleWhole, closeWhole, selected, data, setData } = props;
  const { t } = useTranslation();
  const [sites, setSites] = useState([]);
  const [price, setPrice] = useState({ value: '' });
  const [qty, setQty] = useState({ value: '' });

  useEffect(() => {
    setSites(data?.filter(d => d.checked)?.map(d => {
      d.checkedS = selected?.original?.siteId === d?.siteId;
      d.checkedSOrg = selected?.original?.siteId === d?.siteId;
      return d;
    }));
    setPrice({ value: selected?.original?.wholePrice ?? 0 });
    setQty({ value: selected?.original?.wholeQty ?? 0 });
    return () => {};
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    let wholePrice = parseFloat(price?.value ? price?.value : 0);
    let wholeQty = parseFloat(qty?.value ? qty?.value : 0);
    if(wholePrice && wholeQty){
      setData(sites?.map(s => {
        if(s?.checkedS) return {...s, useWholePrice: 'Y', wholePrice, wholeQty };
        else return s;
      }));
      closeWhole();
    } else {
      if(!wholePrice) setPrice({...price, error: t('error.not_empty') })
      if(!wholeQty) setQty({...qty, error: t('error.not_empty') })
    }
  }

  const onChangeQty = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setQty({...value, error: 'must_number'});
    else setQty({ value: text });
  }

  return (
    <Modal title={null} footer={null} closable={false} open={visibleWhole} centered={true} width={400}>
      <div className='m_back'>
        <p className='m_title'>{t('inventory.t_wholeprice')}</p>
        <div className='m_scroll'>
          <form onSubmit={onClickSave}>
            <MoneyInput
              value={price}
              setValue={setPrice}
              label={t('inventory.price')}
              placeholder={t('inventory.price')} />
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
        onClickCancel={closeWhole}
        onClickSave={onClickSave}
        type='submit'
        isModal={true} />
    </Modal>
  );
}