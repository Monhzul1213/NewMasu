import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";

import { ButtonRow, Error, Input, Overlay, ModalTitle, MoneyInput } from "../../../all";

export function InventoryDetailEdit(props){
  const { visible, setVisible, selected, onSave } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barCode, setBarcode] = useState({ value: '' });

  useEffect(() => {
    setName({ value: selected?.variantName ?? '' });
    setPrice({ value: selected?.price ?? '' });
    setCost({ value: selected?.cost ?? '' });
    setSku({ value: selected?.sku ?? '' });
    setBarcode({ value: selected?.barCode ?? '' });
    return () => {};
  }, []);

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(name?.value){
      setLoading(true);
      let data = {
        variantID: selected?.variantId, variantName: name?.value,
        price: parseFloat(price?.value ? price?.value : 0), cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barCode: barCode?.value?.trim(), rowStatus: 'U'
      };
      let response = await onSave(data);
      if(response?.error) setError(response?.error);
      else setVisible(false);
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
    }
  }
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle title={t('inventory.edit_variant')} />
          <div className='m_scroll'>
            <form onSubmit={onClickSave}>
              <Input
                label={t('page.name')}
                placeholder={t('page.name')}
                value={name}
                setValue={setName}
                setError={setError} />
              <div className='ac_row'>
                <MoneyInput
                  label={t('inventory.price')}
                  placeholder={t('inventory.price')}
                  value={price}
                  setValue={setPrice}
                  setError={setError} />
                <div className='gap1' />
                <MoneyInput
                  label={t('inventory.cost')}
                  placeholder={t('inventory.cost')}
                  value={cost}
                  setValue={setCost}
                  setError={setError} />
              </div>
              <Input
                label={t('inventory.sku')}
                placeholder={t('inventory.sku')}
                value={sku}
                setValue={setSku}
                setError={setError} />
              <Input
                label={t('inventory.barcode')}
                placeholder={t('inventory.barcode')}
                value={barCode}
                setValue={setBarcode}
                setError={setError}
                handleEnter={onClickSave} />
            </form>
            {error && <Error error={error} id='m_error' />}
          </div>
        </div>
        <ButtonRow type='submit' onClickSave={onClickSave} onClickCancel={() => setVisible(false)} />
      </Overlay>
    </Modal>
  );
}