import React, { useState } from "react";
import { ButtonRowAdd, Check, Input, PlainSelect, UploadImage } from "../../all";
import { useTranslation } from "react-i18next";
import { Account } from "./Account";

export function InvoiceSettings(props){
  const { t } = useTranslation();
  const {changeSite, site, sites, image, setImage, setImage64, setImageType, setError, setEdited, date, setDate, accounts, setAccounts,} = props;
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);

  const toggleAccount = index => {
    const updated = [...accounts];
    updated[index].checked = !updated[index].checked;
    setAccounts(updated);
  };

  const onClickAdd = (row) => {
    setSelected(row);
    setVisible(true)
  };

  const closeModal = () => {
    setVisible(false);
    setSelected()
  };
  
  const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'co_select' };
  const logoProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'co_image' };
  const dateProps = { value: date, setValue: setDate, label: t('bill.invoice_enddate'), placeholder: t('bill.invoice_enddate'), classBack: 'co_select_back', className: 'co_input'};
  const addProps = { type: 'account', onClickAdd};
  const modalProps = { visible, closeModal, setData: setAccounts, selected, setSelected };

  return (
      <div>
        <Account {...modalProps}/>
        <p className='co_title'>{t('document.invoice_design')}</p>
        <PlainSelect {...siteProps} />
        <div className='gap' />
        <p className='select_lbl'>{t('document.logo')}</p>
        <UploadImage {...logoProps} />
        <Input {...dateProps}/>
        {accounts?.length > 0 && 
          <div className="account-list">
            <p className="select_lbl">{t('account.title')}</p>
            {accounts.map((acc, index) => (
              <div key={index} className="account_item">
                <Check
                  checked={acc.checked}
                  onClick={e => {toggleAccount(index)}}
                />
                <div className="account-info" onClick={() => onClickAdd(acc)}>
                  <span className="account-number">{acc.account}</span>
                  <span className="account-name">{acc.accountName}</span>
                  <span className="account-phone">{acc.phone}</span>
                </div>
              </div>
            ))}
          </div>}
        <div className='gap' />
        <ButtonRowAdd {...addProps}/>
      </div>
  );
}