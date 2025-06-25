import React, { useEffect, useState } from "react";
import { Checkbox } from 'antd';
import { Link, createSearchParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import '../../css/login.css';
import { apiLogin, setIsLoggedIn, setLogin } from "../../services";
import { header_image } from "../../assets";
import { LoginInput, LoginLanguage, LoginPassword, Social } from "../../components/login";
import { Button, DynamicAIIcon, Error } from "../../components/all";

export function Login(){
  const { t } = useTranslation();
  const [email, setEmail] = useState({ value: '', error: null });
  const [password, setPassword] = useState({ value: '', error: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const { webUser, toRemember } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(webUser?.mail) setEmail({ value: webUser?.mail });
    if(toRemember && webUser?.password) setPassword({ value: webUser?.password });
    if(toRemember) setChecked(true);
    return () => {};
  }, []);
  
  const handleSubmit = async e => {
    e?.preventDefault();
    setError(null);
    if(email?.value && password?.value?.trim()){
      setLoading(true);
      const response = await dispatch(apiLogin(email?.value, password?.value?.trim()));
      if(response?.error) setError(response?.error);
      else {
        dispatch(setLogin({ toRemember: checked }));
        dispatch(setIsLoggedIn(true));
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        navigate({ pathname: '/' });
      }
      setLoading(false);
    } else {
      if(!email?.value) setEmail({ value: '', error: t('error.not_empty') });
      if(!password?.value?.trim()) setPassword({ value: '', error: t('error.not_empty') });
    }
  }

  const onForgot = () => {
    navigate({ pathname: "/recovery", search: createSearchParams({ email: email?.value }).toString()});
  }

  return (
    <div className='login_container'>
      <div style={{padding: 20}} />
      <img className='login_logo' src={header_image} alt='MASU LOGO' />
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_title'>Welcome <span className='lg_title2'>Back</span>!</p>
      <LoginLanguage id='login_language' />
      <form onSubmit={handleSubmit} style={{width: '330px'}}>
        <LoginInput
          className='lg_input_back'
          isLogin={true}
          value={email}
          color='#fff'
          setError={setError}
          setValue={setEmail}
          text={t('login.email')}
          Icon={() => <DynamicAIIcon className='lg_input_icon' name='AiOutlineUser'/> } />
        <LoginPassword
          classIcon='lg_input_icon' className='lg_input_back' classShow='lg_input_show'
          value={password}
          setValue={setPassword}
          setError={setError}
          isLogin={true}
          color='#fff'
          text={t('login.password')}
          handleEnter={handleSubmit} />
        {error && <Error error={error} id='lg_error' />}
        <Button
          type='submit'
          loading={loading}
          className='lg_login_btn'
          text={t('login.login1')} />
        <div className='login_btn_row'>
          <Checkbox className='lg_login_check' checked={checked} onChange={e => setChecked(e?.target?.checked)}>{t('login.remember')}</Checkbox>
          <span className='lg_login_link' onClick={onForgot}>{t('login.forgot')}</span>
        </div>
        <div style={{padding: 10}} />
        <div className='login_center_row'>
          <Link className='lg_login_link2' to='/sign_up'>{t('login.new_sign')}</Link>
        </div>
      </form>
      <div style={{padding: 10}} />
      <div style={{flex: 1}} />
      <p className='lg_footer'>masu cloud platform</p>
      <div style={{padding: 10}} />
      <Social />
    </div>
  );
}