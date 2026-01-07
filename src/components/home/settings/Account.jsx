import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';

import { Input, Error, Overlay, Select, ButtonRow, ModalTitle, CheckBox  } from '../../all';

export function Account(props){
  const { visible, closeModal, setData, selected, setSelected } = props;
  const { t,  } = useTranslation();
  const [number, setNumber] = useState({ value: '' });
  const [bank, setBank] = useState({ value: 'haan' });
  const [banks, setBanks] = useState([{ value: 'haan', label: 'Хаан банк' }]);
  const [name, setName] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(selected){
      setBank({ value: selected?.bank ?? 'haan' });
      setPhone({ value: selected?.phone ?? '' });
      setName({ value: selected?.accountName ?? '' });
      setStatus(selected?.status === 1 && selected?.checked);
      setNumber({ value: selected?.account ?? '' });
    } else {
      clearForm();
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const clearForm = () => {
    setBank({ value: 'haan' });
    setNumber({ value: '' });
    setName({ value: '' });
    setPhone({ value: '' });
    setStatus(false);
    setSelected(null);
  };
  

  const onClickSave = async e => {
    e?.preventDefault();
    setLoading(true);
  
    if (!number?.value) {
      setError(t('bill.acct_empty'));
      setLoading(false);
      return;
    }
  
    const newAccount = {
      account: number?.value,
      bank: bank?.value,
      accountName: name?.value,
      phone: phone?.value,
      status: status ? 1 : 0,
      checked: status
    };
  
    setData(prev => {
      if (selected) {
        return prev.map(acc =>
          acc.account === selected.account ? {...acc, ...newAccount} : acc
        );
      } else {
        return [...(prev || []), newAccount];
      }
    });
  
    setLoading(false);
    closeModal();
    clearForm();
  };
  
  

  const onFocusBank = async () => {
    if(!banks?.length || banks?.length === 1){
      setBanks([
        { value: 'haan', label: 'Хаан банк' },
        { value: 'tdb', label: 'Худалдаа хөгжлийн банк' },
        { value: 'golomt', label: 'Голомт банк' },
        { value: 'has', label: 'Хас банк' },
        // { value: 4, label: 'Төрийн банк' }
      ]);
    }
  }

  const btnProps = { onClickCancel: () => closeModal(), onClickSave, type: 'submit' };
  const numberProps = {value: number, setValue: setNumber, label: t('account.acctCode'), placeholder: t('account.acctCode'), setError}
  const bankProps = { value: bank, setValue: setBank, data: banks, s_value: 'value', s_descr: 'label', label: t('bill.bank'), onFocus: onFocusBank };
  const nameProps = {value: name, setValue: setName, label: t('manage.acctName'), placeholder: t('manage.acctName'), setError}
  const phoneProps = {value: phone, setValue: setPhone, label: t('bill.phone'), placeholder: t('bill.phone'), setError}
  const kdsProps = { label: status ? t('bill.active') : t('bill.inactive'), checked: status, setChecked: setStatus };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={closeModal} style={{marginTop: 150, marginRight: 400}} width={400}>
      <Overlay loading={loading} className='m_back2'>
        <div>
          <ModalTitle title={t('account.add')} />
          <Select {...bankProps}/>
          <Input {...numberProps}/>
          <Input {...nameProps}/>
          <Input {...phoneProps}/>
          <CheckBox {...kdsProps} />
        </div>
        {error && <Error error={error} id = 'm_error' />}
        <ButtonRow {...btnProps} />
      </Overlay>
    </Modal>
  );
}


