import React, { useState } from "react";
import { createSearchParams, Link, useNavigate } from "react-router";
import { Checkbox } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import '../../css/login.css';
import { apiLogin, apiRegister, getService, setIsLoggedIn, setLogin } from "../../services";
import { validateEmail, validateNumber } from "../../helpers/helper";
import { header_image } from "../../assets";
import { Button, DynamicAIIcon, DynamicMDIcon, Error } from "../../components/all";
import { LoginConfirm, LoginInput, LoginLanguage, LoginPartner, LoginPassword, LoginSelect, Social } from "../../components/login";

export function Signup(){
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [business, setBusiness] = useState({ value: '', error: null });
  const [activity, setActivity] = useState({ value: null });
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [addItem, setAddItem] = useState({ value: '' });
  const [address, setAddress] = useState({ value: '', error: null });
  const [partner, setPartner] = useState({ value: '', error: null });
  const [expire, setExpire] = useState(null);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onChangePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    setAddress({ value: text });
  }

  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()) sendSMS();
  }

  const checkValid = () => {
    let item = (activity?.value === 199 || activity?.value === 205) ? addItem?.value : !addItem?.value
    let passwordLength = 8, businessLength = 6;
    let isValid = email?.value && password?.value && business?.value && address?.value?.trim();
    let isEmailValid = validateEmail(email?.value);
    let isPasswordValid = password?.value?.length >= passwordLength;
    let isBusinessValid = business?.value?.length >= businessLength;
    let isAddressValid = validateNumber(address?.value?.trim());
    let isPartnerValid = (partner?.value && partner?.name) || (!partner?.value && !partner?.name) ? true : false;
    if(isValid && isEmailValid && isPasswordValid && isBusinessValid && isAddressValid && isPartnerValid && activity?.value && item){
      return true;
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      else if(!isEmailValid) setEmail({ value: email?.value, error: t('error.be_right') });
      if(!password?.value) setPassword({ value: '', error: t('error.not_empty') });
      else if(!isPasswordValid) setPassword({ value: password?.value, error: ' ' + passwordLength + t('error.longer_than') });
      if(!business?.value) setBusiness({ value: '', error: t('error.not_empty') });
      else if(!isBusinessValid) setBusiness({ value: business?.value, error: ' ' + businessLength + t('error.longer_than') });
      if(!address?.value?.trim()) setAddress({ value: '', error: t('error.not_empty') });
      else if(!isAddressValid) setAddress({ value: address?.value?.trim(), error: t('error.be_right') });
      if(!isPartnerValid) setPartner({...partner, error: t('login.partner') + ' ' + t('error.be_right') })
      if(!activity?.value) setActivity({ value: null, error: t('error.select') });
      if(!addItem?.value) setAddItem({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const sendSMS = async () => {
    const diff = expire - new Date();
    if(expire && diff > 0){
      setVisible(true);
    } else {
      setLoading(true);
      let api = 'Merchant/SentSMS?mobile=' + address?.value?.trim() + '&email=' + email?.value?.trim();
      let response = await dispatch(getService(api));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 300);
        setExpire(time);
        setVisible(true);
      }
    }
  }

  const closeModal = sure => {
    setVisible(false);
    if(sure) login();
  }

  const login = async () => {
    setLoading(true);
    let data = {
      mail: email?.value, password: password?.value, descr: business?.value, address: address?.value?.trim(), partnerCode: partner?.value ?? '' ,
      merchantType: 0, merchantSubType : activity?.value, addSubDescr: addItem?.value };
    const response = await dispatch(apiRegister(data));
    if(response?.error) setError(response?.error);
    else {
      const response2 = await dispatch(apiLogin(data?.mail, data?.password));
      if(response2?.error) setError(response2?.error);
      else {
        dispatch(setLogin({ toRemember: true }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/config', search: createSearchParams({ mode: 'is_first' }).toString() });
      }
    }
    setLoading(false);
  }

  return (
    <div className='login_container'>
      {visible && <LoginConfirm visible={visible} closeModal={closeModal} number={address?.value} expire={expire} email={email?.value} />}
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <LoginLanguage id='login_language' />
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title1'>{t('login.signup_text')}</p>
      <form onSubmit={handleSubmit} autoComplete='off' style={{width: 400, maxWidth: 'var(--safe-width)', padding: '0 15px', maxHeight: 620, overflow: 'scroll'}} id='y_scroll'>
        <LoginInput
          className='lg_input_back' color='#fff'
          text={t('login.email')}
          value={email}
          setValue={setEmail}
          setError={setError}
          Icon={() => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/>} />
        <LoginPassword
          className='lg_input_back' classIcon='lg_input_icon' classShow='lg_input_show' color='#fff'
          text={t('login.password')}
          value={password}
          setValue={setPassword}
          setError={setError} />
        <LoginInput
          className='lg_input_back' color='#fff'
          text={t('login.business')}
          value={business}
          setValue={setBusiness}
          setError={setError}
          Icon={() => <DynamicMDIcon className='lg_input_icon' name='MdOutlineBusinessCenter'/>} />
        <LoginSelect
          value={activity}
          setValue={setActivity}
          setError={setError}
          setLoading={setLoading}
          addItem={addItem}
          setAddItem={setAddItem} />  
        <LoginInput
          className='lg_input_back' color='#fff'
          text={t('login.phone')}
          value={address}
          setValue={onChangePhone}
          setError={setError}
          Icon={() => <DynamicAIIcon className='lg_input_icon' name='AiOutlinePhone'/>} />
        <LoginPartner partner={partner} setPartner={setPartner} />
        <div className='co_gap' />
        <div className='co_gap' />
        <div className='l_check_row'>
          <div>
            <Checkbox className='login_check' checked={checked} onChange={e => setChecked(e?.target?.checked)} />
          </div>
          <p className='l_term'>
            {t('login.sign_accept1')}
            <a className='lg_term_link' target='_blank' rel="noreferrer" href='https://masu.mn/terms-conditions/'>{t('login.sign_accept2')}</a>
            {t('login.sign_accept3')}
            <a className='lg_term_link' target='_blank' rel="noreferrer" href='https://masu.mn/privacy-policy/'>{t('login.sign_accept4')}</a>
            {t('login.sign_accept5')}
          </p>
        </div>
        {error && <Error error={error} id='lg_error' />}
        <div style={{position: 'sticky', zIndex: 1, bottom: 10}}>
          <Button
            loading={loading}
            type='submit'
            className='lg_login_btn'
            text={t('login.signup1')}
            disabled={!checked} />
        </div>
      </form>
      <div style={{padding: 10}} />
      <div className='l_center_row'>
        <p className='l_link_text'>{t('login.go_login')}</p>
        <Link className='login_link1' to='/'>{t('login.login')}</Link>
      </div>
      <div style={{flex: 1}} />
      <p className='lg_footer'>masu cloud platform</p>
      <div style={{padding: 10}} />
      <Social />
    </div>
  );
}