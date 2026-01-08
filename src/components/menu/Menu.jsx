// import React, { useEffect, useState } from "react";
// import { Layout, Menu as AntMenu } from 'antd';
// import { useLocation, useNavigate } from "react-router";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";

// import { getItem } from "../../helpers";
// import { getList, setCollapsed } from "../../services";
// import { Logo } from "./Logo";
// import { customer, expenses, home, integration, invoice, payment, product, receipt, report, settings } from "../../assets/menu";
// import { Bottom } from "./Bottom";
// import { Rating } from "./Rating";
// const { Sider } = Layout;

// export function Menu(){
//   const { t } = useTranslation();
//   const [hideMenu, setHideMenu] = useState(false);
//   const [openKeys, setOpenKeys] = useState([]);
//   const [review, setReview] = useState(false);
//   const [isFree, setIsFree] = useState(false);
//   const { pathname } = useLocation();
//   const { user, token } = useSelector(state => state.login);
//   const msRole = user?.msRole;
//   const collapsed = useSelector(state => state.temp.collapsed);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const path = pathname?.split('/') && pathname?.split('/')[1];
//   const rootSubmenuKeys = ['/report', '/inventory', '/customer'];

//   useEffect(() => {
//     let pathname1 = pathname?.toLowerCase();
//     let hideMenu = pathname1?.includes('bill') || pathname1?.includes('statement');
//     setHideMenu(hideMenu);
//     return () => {};
//   }, [pathname])

//   useEffect(() => {
//     getData();
//     return () => {};
//   }, []);

//   const getData = async () => {
//     await getConfig();
//     getReview();
//   }

//   const getConfig = async () => {
//     const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
//     const type = response?.data?.subscriptionType;
//     setIsFree(type !== 'PREMIUM' && type !== 'STANDARD')
//   }

//   const getReview = async () => {
//     const response = await dispatch(getList(user, token, 'Merchant/GetReviewItem'));
//     const review = response?.data?.filter(item => item.isShow !== 'Y')[0];
//     setReview(review);
//   }

//   const style = {
//     overflowY: 'auto',
//     overflowX: 'hidden',
//     boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
//     zIndex: 1000
//   };

//   const onClick = (e, hide) => {
//     if(e?.key === '/help') window.open("https://help.masu.mn");
//     else navigate(e?.key);
//     if(hide) dispatch(setCollapsed(true));
//   }

//   const onOpenChange = keys => {
//     const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
//     if(rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
//       setOpenKeys(keys);
//     } else {
//       setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
//     }
//   };

//   const items = [
//     getItem(t('menu.home'), '/', <img src={home} alt='home' />),
//     getItem(t('menu.report'), '/report', <img src={report} alt='report' />, [
//       getItem(t('menu.report'), '/report/report1'),
//     ]),
//   ];

//   const onCollapse = value => dispatch(setCollapsed(value));
  
//   const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline', openKeys, onOpenChange };
//   const maxHeight = 'calc(100vh - ' + (collapsed ? 130 : 260) + 'px)';
//   const rateProps = { review, setReview };

//   return hideMenu ? null : (
//     <>
//       <Rating {...rateProps} />
//       <Sider
//         collapsible={true} trigger={null} collapsedWidth='var(--side-width)' collapsed={collapsed} style={style}
//         breakpoint='lg' width={300} onCollapse={onCollapse}>
//         <Logo />
//         <div className='mi_top' style={{ maxHeight }}>
//           <AntMenu {...menuProps} />
//         </div>
//         <Bottom />
//       </Sider>
//     </>
//   );
// }
import React, { useEffect, useState } from 'react';
import { Layout, Menu as AntMenu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/menu.css';
import { getList, setCollapsed } from '../../services';
import { getItem } from '../../helpers';
// import { Profile1 } from './Profile';
// import { MenuPayment } from './Install';
import { Logo } from "./Logo";
import { Rating } from './Rating';
import { customer, expenses, home, integration, invoice, payment, product, receipt, report, settings } from "../../assets/menu";
const { Sider } = Layout;

export function Menu(props){
  const { size } = props;
  const { t } = useTranslation();
  const [openKeys, setOpenKeys] = useState([]);
  const [hideConfig, setHideConfig] = useState(true);
  const [hideTime, setHideTime] = useState(true);
  const [hideMenu, setHideMenu] = useState(false);
  const [review, setReview] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState(false);
  const { user: { msRole, isAdmin }, isPartner, user, token } = useSelector(state => state.login);
  const collapsed = useSelector(state => state.temp.collapsed);
  const { pathname } = useLocation();
  const path = pathname?.split('/') && pathname?.split('/')[1];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let pathname1 = pathname?.toLowerCase();
    let hideMenu = pathname1?.includes('confirm') || pathname1?.includes('bill') || (!pathname1?.includes('management') && pathname1?.includes('order')) 
    || pathname1?.includes('statement') || pathname1?.includes('inv_pdf') || pathname1?.includes('tax_pdf') || pathname1?.includes('sales_pdf') || pathname1?.includes('taxprinta5');
    setHideMenu(hideMenu);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    dispatch(setCollapsed(size?.width > 740 ? false : true));
    if(isAdmin) setOpenKeys(["system", "/system"]);

    getReview();
    getConfig();

    if (
      user?.merchantId === 66 ||
      user?.merchantId === 135 ||
      user?.merchantId === 383 ||
      user?.merchantId === 631 ||
      user?.merchantId === 270 ||
      user?.merchantId === 164 ||
      user?.merchantId === 700 ||
      user?.merchantId === 724 ||
      user?.merchantId === 999 ||
      user?.merchantId === 1226
    )
      setHideTime(false);
    else
      setHideTime(true);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let width = (size?.width ?? 1500) - 30 - (collapsed ? 72 : 300);
    setHideConfig(width >= 1000);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width, collapsed]);

  const getReview = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetReviewItem'));
    const review = response?.data?.filter(item => item.isShow !== 'Y')[0];
    setReview(review);
  }

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setSubscriptionType(response?.data?.subscriptionType)
  }

  const style = {
    overflowY: 'auto',
    overflowX: 'hidden',
    boxShadow: '0px 2px 5px rgba(0,0,0,.15)',
    zIndex: 1000
  };

  const menuIcon = src => (
    <span className="ant-menu-item-icon">
      <img src={src} alt="" style={{ width: 18, height: 18 }} />
    </span>
  );
  
  const items = isPartner ? [
    getItem(t('menu.partner'), '/partner', <img src={receipt} alt='image13'/>),
  ] : isAdmin ? [
    getItem(t('menu.system'), '/system', <img src={report} alt='image14'/>, [
      getItem(t('menu.solve'), '/system/request_solve'),
      getItem(t('menu.invoice'), '/system/invoice'),
      getItem(t('menu.info'), '/system/info'),
      getItem(t('menu.system_partner'), '/system/partner'),
      getItem(t('menu.advert'), '/system/advert'),
      getItem(t('menu.noti'), '/system/notification'),
      getItem(t('menu.rating'), '/system/rating'),
      getItem(t('menu.system_change'), '/system/system_change')
    ])
  ] : [
    getItem(t('menu.home'), '/control', menuIcon(home), null, null, msRole?.webManageItem !== 'Y'),
    getItem(t('menu.inventory'), '/inventory', menuIcon(product), [
      getItem(t('menu.inventory'), '/inventory/invt_list', null, null, null, msRole?.webManageItem !== 'Y'),
      getItem(t('menu.invt_category'), '/inventory/invt_category', null, null, null, msRole?.webManageItem !== 'Y'),
    ]),    
    // getItem(t('menu.help'), '/help', <img src={settings} alt='image11' />),
  ];

  const onClick = (e, hide) => {
    if(e?.key === '/help') window.open("https://help.masu.mn");
    else navigate(e?.key);
    if(hide) dispatch(setCollapsed(true));
  }

  const rootSubmenuKeys = ['/report', '/inventory', '/management', '/employee', '/customer', '/loyalty', '/timetable', '/integration', '/config', '/help'];

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const onCollapse = value => dispatch(setCollapsed(value));

  const siderProps = { collapsible: true, trigger: null, collapsedWidth: 'var(--side-width)', collapsed, style, breakpoint: 'lg', width: 300,
    onCollapse };
  const profileProps = { collapsed, setCollapsed, subscriptionType };
  const menuProps = { items, onClick, className: 'side_menu', selectedKeys: ['/' + path, pathname], mode: 'inline', openKeys, onOpenChange };
  const rateProps = { review, setReview };

  return hideMenu ? null : (
    <>
      <Rating {...rateProps} />
      <Sider {...siderProps}>
        <Logo {...profileProps} />
        <div className='mi_top'>
          <AntMenu {...menuProps} />
        </div>
        {/* {!isPartner && <Install {...profileProps} />} */}
        {/* {!isPartner && <MenuPayment {...profileProps} />} */}
      </Sider>
    </>
  )
}
