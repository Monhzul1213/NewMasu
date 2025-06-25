import React, { useEffect, useState } from "react";
import { Checkbox, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { getService } from "../../services";
import { LoginInput1 } from "./LoginInput";
import { Button, ButtonRow } from "../all";

export function LoginPartner(props){
  const { t } = useTranslation();
  const { partner, setPartner } = props;
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const onChange = e => {
    setChecked(e?.target?.checked);
    if(e?.target?.checked) setOpen(true);
    else setPartner({ value: '' });
  }

  const onPressPartner = e => {
    e?.preventDefault();
    setOpen(true);
  }

  const modalProps = { open, setOpen, setChecked, partner, setPartner };
  const text = (partner?.value ?? '') + ' - ' + (partner?.name ?? '');

  return (
    <div>
      {open && <LoginPartnerModal {...modalProps} />}
      <div className='l_partner_check'>
        <Checkbox className='login_check' checked={checked} onChange={onChange} />
        <p className='l_partner_check_lbl'>{t('login.is_partner')}</p>
      </div>
      {checked && partner?.value
        ? <Button text={text} className='lg_partner_field' onClick={onPressPartner} />
        : null}
    </div>
  );
}

export function LoginPartnerModal(props){
  const { open, setOpen, setChecked, partner, setPartner } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({ value: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    setValue(partner);
    return () => {};
  }, []);

  const handlePartner = async e => {
    e?.preventDefault();
    setLoading(true);
    let api = 'Merchant/GetPartner?partnercode=' + value?.value;
    let response = await dispatch(getService(api, 'GET'));
    if(response?.error) setValue({...value, error: response?.error });
    else {
      let name = response?.data?.retdata?.partner?.partnerName ?? '';
      setValue({...value, name, error: null });
    }
    setLoading(false);
  }

  const closeModal = () => {
    setOpen(false);
    if(!(partner?.value && partner?.name)) setChecked(false);
  }

  const onClickSave = () => {
    if(value?.value && value?.name){
      setPartner(value);
      setOpen(false);
    } else
      setValue({...value, error: t('login.partner_error') })
  }
  
  const disabled = value?.value ? false : true;

  return (
    <Modal title={null} footer={null} closable={false} open={open} centered={true} width={360}>
      <div className='m_back'>
        <div className='l_partner_row'>
          <LoginInput1
            text={t('login.partner')}
            value={value}
            setValue={setValue}
            handleEnter={handlePartner}
            id='l_partner' />
          <Button
            className='l_partner_btn'
            text={t('login.check')}
            disabled={disabled}
            onClick={handlePartner}
            loading={loading} />
        </div>
        <LoginInput1
          text={t('login.partner_name')}
          value={{ value: value?.name ?? '' }}
          disabled={true} />
      </div>
      <ButtonRow onClickCancel={closeModal} onClickSave={onClickSave} text1='login.close' />
    </Modal>
  );
}