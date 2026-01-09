import React, { useState } from "react";
import { Modal } from "antd";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { validateEmail } from "../../../helpers";
import { sendRequest } from "../../../services";
import { ButtonRow, CheckBox, Error, Input, Overlay, ModalTitle, UploadImage, Validate } from "../../all";

export function VendorAdd(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [name, setName] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '' });
  const [phone, setPhone] = useState({ value: '' });
  const [email, setEmail] = useState({ value: '' });
  const [web, setWeb] = useState({ value: '' });
  const [address1, setAddress1] = useState({ value: '' });
  const [note, setNote] = useState({ value: '' });
  const [isOTC, setIsOTC] = useState(false);
  const [cust, setCust] = useState({ value: '' });
  const [rep, setRep] = useState({ value: '' });
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number' });
    else setPhone({ value: text });
  } 

  const checkValid = () => {
    let phoneLength = 8;
    let isPhoneValid = !phone?.value?.trim() || phone?.value?.length >= phoneLength;
    let isEmailValid = !email?.value?.trim() || validateEmail(email?.value?.trim());
    let isCustValid = isOTC ? cust?.value?.trim() : true;
    let isRepValid = isOTC ? rep?.value?.trim() : true;
    if(isEmailValid && name?.value?.trim() && isPhoneValid && isCustValid && isRepValid){
      return true;
    } else {
      if(!name?.value?.trim()) setName({ value: '', error: t('error.not_empty') });
      if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      if(!isPhoneValid) setPhone({ value: phone?.value, error: ' ' + phoneLength + t('error.longer_than') });
      if(!isCustValid && !cust?.value?.trim()) setCust({...cust, error: t('error.not_empty') });
      if(!isRepValid && !rep?.value?.trim()) setRep({...rep, error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    if(checkValid()){
      setLoading(true);
      let data = [{
        vendId: -1,
        vendName: name?.value?.trim(),
        contact: '',
        email: email?.value?.trim(),
        phone: phone?.value?.trim(),
        webSite: web?.value?.trim(),
        address1: address?.value?.trim(),
        address2: address1?.value?.trim(),
        vendCode: '',
        note: note?.value?.trim(),
        rowStatus: "I",
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        city: "", region: "", postalCode: "", country: "",
        useOtcorder: isOTC ? 'Y' : 'N',
        vendorCustId: isOTC ? cust?.value : "",
        vendorCustName: isOTC ? cust?.name : "",
        vendSalesRepId: isOTC ? rep?.value : "",
        vendSalesRepName: isOTC ? rep?.name : "",
      }];
      const response = await dispatch(sendRequest(user, token, 'Merchant/vendor', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let id = response?.data && response?.data[0] && response?.data[0]?.vendId;
        closeModal(true, id);
      }
    }
  }
  
  const imageProps = { image, setImage, setImage64, setImageType, setError };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={420}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='TbCar' title={t('supplier.add')} />
          <div className='m_scroll' id='im_small'>
            <UploadImage {...imageProps} className='im_add_image' />
            <form onSubmit={onClickSave}>
              <Input
                label={t('page.name')}
                placeholder={t('supplier.name')}
                value={name}
                setValue={setName}
                setError={setError} />
              <CheckBox
                label={t('supplier.is_otc')}
                checked={isOTC}
                setChecked={setIsOTC} />
              <Validate label='cust' value={cust} setValue={setCust} disabled={!isOTC} api='GetCustName?CustID=' />
              <Validate label='rep' value={rep} setValue={setRep} disabled={!isOTC} api='GetSrName?SalesRepID=' />
              <Input
                label={t('login.email')}
                placeholder={t('supplier.email')}
                value={email}
                setValue={setEmail}
                setError={setError}
                length={100} />
              <Input
                label={t('customer.t_phone')}
                placeholder={t('supplier.phone')}
                value={phone}
                setValue={changePhone}
                setError={setError} />
              <Input
                label={t('supplier.web')}
                placeholder={t('supplier.web')}
                value={web}
                setValue={setWeb}
                setError={setError}
                length={100} />
              <Input
                label={t('supplier.address1')}
                placeholder={t('supplier.address1')}
                value={address}
                setValue={setAddress}
                setError={setError}
                length={192} />
              <Input
                label={t('supplier.address2')}
                placeholder={t('supplier.address2')}
                value={address1}
                setValue={setAddress1}
                setError={setError}
                length={100} />
              <Input
                label={t('supplier.desc')}
                placeholder={t('supplier.desc')}
                value={note}
                setValue={setNote}
                setError={setError}
                length={255} />
              <div style={{height: 2}} />
            </form>
          </div>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow type='submit' onClickCancel={() => closeModal()} onClickSave={onClickSave} />
      </Overlay>
    </Modal>
  );
}