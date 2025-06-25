import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import '../../css/login.css';
import { apiRecovery } from "../../services";
import { header_image } from "../../assets";
import { Button, DynamicAIIcon, Error } from "../../components/all";
import { LoginInput, LoginLanguage, Social } from "../../components/login";

export function Recovery(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [value, setValue] = useState({ value: '' });
  const [sent, setSent] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    let email = searchParams?.get('email');
    setValue({ value: email ?? '' });
    return () => {};
  }, []);

  const onClick = async e => {
    setLoading(true);
    setError(null);
    const response = await dispatch(apiRecovery(value?.value));
    if(response?.error) setError(response?.error);
    else setSent(true);
    setLoading(false);
  }
  
  return (
    <div className='login_container'>
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <LoginLanguage id='login_language' />
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title'>{t('login.recovery')}</p>
      <div style={{ width: 300 }}>
        <LoginInput
          className='lg_input_back'
          color='#fff'
          value={value}
          setValue={setValue}
          text={t('login.email')}
          setError={setError}
          handleEnter={onClick}
          Icon={() => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser' />} />
        <Button className='lg_login_btn' text={t('login.send')} onClick={onClick} loading={loading} />
      </div>
      <div className='co_gap' />
      {error && <Error error={error} id='lg_error' />}
      <div className='co_gap' />
      {sent && <div className='co_sent_back'>
        <p className='co_sent_text'>{t('login.sent')}</p>
      </div>}
      <div className='l_center_row'>
        <Link className='lg_login_link2' to='/'>{t('login.back')}</Link>
      </div>
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_footer'>Invoice for you</p>
      <div style={{padding: 5}} />
      <Social />
    </div>
  );
}