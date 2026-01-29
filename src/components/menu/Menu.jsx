import React, { useEffect, useState } from "react";
import { Layout, Menu as AntMenu } from 'antd';
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getItem } from "../../helpers";
import { getList, setCollapsed } from "../../services";
import { Logo } from "./Logo";
import { customer, expenses, home, integration, invoice, payment, product, receipt, report, settings } from "../../assets/menu";
import { Bottom } from "./Bottom";
import { Rating } from "./Rating";
const { Sider } = Layout;

export function Menu(){
  const { t } = useTranslation();
  const [hideMenu, setHideMenu] = useState(false);
  const [hideMenuItem, setHideMenuItem] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [review, setReview] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const { pathname } = useLocation();
  const { user, token } = useSelector(state => state.login);
  const msRole = user?.msRole;
  const collapsed = useSelector(state => state.temp.collapsed);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const rootSubmenuKeys = ['/report', '/inventory', '/customer'];

  useEffect(() => {
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('bill') || pathname1?.includes('statement') || pathname1?.includes('invoice_doc');
    setHideMenu(hideMenu);
    return () => {};
  }, [pathname])

  useEffect(() => {
    getData();
    if (
      user?.merchantId === 66 ||
      user?.merchantId === 135 ||
      user?.merchantId === 383 ||
      user?.merchantId === 631 ||
      user?.merchantId === 270 ||
      user?.merchantId === 164 ||
      user?.merchantId === 700 ||
      user?.merchantId === 724
      )
      setHideMenuItem(false);
    else
      setHideMenuItem(true);
    return () => {};
  }, []);

  const getData = async () => {
    await getConfig();
    getReview();
  }

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    const type = response?.data?.subscriptionType;
    setIsFree(type !== 'PREMIUM' && type !== 'STANDARD')
  }

  const getReview = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetReviewItem'));
    const review = response?.data?.filter(item => item.isShow !== 'Y')[0];
    setReview(review);
  }

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const onClick = (e, hide) => {
    if(e?.key === '/help') window.open("https://help.masu.mn");
    else navigate(e?.key);
    if(hide) dispatch(setCollapsed(true));
  }

  const onOpenChange = keys => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if(rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const items = [
    getItem(t('menu.home'), '/', <img src={home} alt='home' />),
    // getItem(t('menu.report'), '/report', <img src={report} alt='report' />, [
    //   getItem(t('menu.report'), '/report/report1'),
    // ]),
    getItem(t('menu.inventory'), '/inventory', <img src={product} alt='product' />, [
      getItem(t('menu.invt_list'), '/inventory/invt_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_category'), '/inventory/invt_category', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.customer'), '/customer/customer', null, null, null, msRole?.webManageCustomer !== 'Y'),
      getItem(t('menu.modifier'), '/modifier', null, null, null, msRole?.webManageCustomer !== 'Y'),
    ]),
  ];

  const onCollapse = value => dispatch(setCollapsed(value));
  
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline', openKeys, onOpenChange };
  const maxHeight = 'calc(100vh - ' + (collapsed ? 130 : 260) + 'px)';
  const rateProps = { review, setReview };

  return hideMenu ? null : (
    <>
      <Rating {...rateProps} />
      <Sider
        collapsible={true} trigger={null} collapsedWidth='var(--side-width)' collapsed={collapsed} style={style}
        breakpoint='lg' width={300} onCollapse={onCollapse}>
        <Logo />
        <div className='mi_top' style={{ maxHeight }}>
          <AntMenu {...menuProps} />
        </div>
        {/* <Bottom /> */}
      </Sider>
    </>
  );
}