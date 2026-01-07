import React, { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";

import '../../css/menu.css';
import { image16, image17, image19, image20, image21, image22 } from "../../assets";
import { getList, logout, setIsLoggedIn } from "../../services";
import { LoginLanguage } from "../login";
import { Button, DynamicMDIcon } from "../all";

export function Header(){
  const { i18n, t } = useTranslation();
  const [hideMenu, setHideMenu] = useState(false);
  const [title, setTitle] = useState('Home');
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(image22);
  const [image2, setImage2] = useState(image20);
  const { user, isOwner, isPartner, token } = useSelector(state => state.login);
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    i18n.exists('header.' + pathname) ? setTitle('header.' + pathname) : setTitle('header./');
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('bill') || pathname1?.includes('statement');
    setHideMenu(hideMenu);
    return () => {};
  }, [pathname]);

  useEffect(() => {
    getConfig();
    return () => {};
  }, []);

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    const subscriptionType = response?.data?.subscriptionType;
    if(subscriptionType === 'PREMIUM'){
      setImage(image16);
      setImage2(image17);
    } else if(subscriptionType === 'STANDARD'){
      setImage(image21);
      setImage2(image19);
    } else {
      setImage(image22);
      setImage2(image20);
    }
  };

  const onClick = () => navigate('/config/type');

  const onClickAccount = e => {
    navigate('/profile');
    setOpen(false);
  }

  const onClickVoucher = e => {
    setVisible(true);
  }

  const closeModal = () => {
    setVisible(false);
  };
  
  const onClickSignout = e => {
    e?.preventDefault();
    dispatch(logout());
    dispatch(setIsLoggedIn(false));
    window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
    window.localStorage.setItem('CREDENTIALS_FLUSH', Date.now().toString());
    window.localStorage.removeItem('CREDENTIALS_FLUSH');
    navigate(isPartner ? 'partner_sign_in' : '/');
  }

  const renderDrop = () => (
    <div className='p_menu'>
      <Button className='p_menu_btn' text={t('profile.account')} onClick={onClickAccount} disabled={!isOwner} />
      <Button className='p_menu_btn' text={t('profile.voucher')} onClick={onClickVoucher}/>
      <Button className='p_menu_btn' text={t('login.signout')} onClick={onClickSignout} />
    </div>
  );

  return hideMenu ? null : (
    <div className='menu_pro_container'>
      {visible && <Voucher visible={visible} closeModal={closeModal}/>}
      <p className='h_title'>{t(title)}</p>
      <Dropdown trigger='click' open={open} onOpenChange={setOpen} popupRender={renderDrop}>
        <div className='p_btn'>
          <img className='img_header' src={image} alt='image17'/>
          <div className='p_side'>
            <div className='header_img_back'>
              <p className='p_title'>{t('menu.profile')}</p>
              <img className='type_img' onClick={onClick} src={image2} alt='image16'/>
            </div>
            <p className='p_user'>{user?.mail?.toLowerCase()}</p>
          </div>
        </div>
      </Dropdown>
      <LoginLanguage className='language_back' id='login_language1' />
    </div>
  );
}