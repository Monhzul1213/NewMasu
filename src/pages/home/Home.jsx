import React, { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";

import '../../css/home.css';
import { getList } from "../../services";
import { HomeTabs } from '../../components/home';
import { HomeDashboard } from "./HomeDashboard";
import { HomeSettings } from "./HomeSettings";
import { HomeInfo } from "./HomeInfo";
import { HomeVersion } from "./HomeVersion";
import { Error1, Overlay } from "../../components/all";

export function Home(){
  const { t } = useTranslation();
  const [tab, setTab] = useState('dashboard');
  const [infoCount, setInfoCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [versions, setVersions] = useState([]);
  const [infos, setInfos] = useState([]);
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'System/GetDashboardService'));
    if(response?.error) setError(response?.error);
    else {
      setVersions(response?.data?.versionhistory?.versionhistoryitem?.sort((a, b) =>
        moment(b.verisionDate, 'YYYY.MM.DD').valueOf() - moment(a.verisionDate, 'YYYY.MM.DD').valueOf()));
      setInfos(response?.data?.notif?.notif?.sort((a, b) => b.createdDate - a.createdDate))
      const items = response?.data?.notif?.notifitem || [];
      const unread = items.filter(item => item.isShow === 'N').length;
      setInfoCount(unread);
    //   const item1 = response?.data?.versionhistory?.versionhistoryitem;
    }
    setLoading(false);
  };

  const barProps = { tab, setTab, infoCount };
  const dashProps = { tab };
  const versionProps = { tab, getData, versions };
  const infoProps = { tab, getData, infos };

  const items = [
    { key: 'dashboard', label: t('home.dashboard'), children: <HomeDashboard {...dashProps} /> },
    { key: 'settings', label: t('home.settings'), children: <HomeSettings /> },
    { key: 'info', label: t('home.info'), children: <HomeInfo {...infoProps}/> },
    { key: 'version', label: t('home.version'), children: <HomeVersion {...versionProps} /> }
  ];

  return (
    <div className='page_container' style={{ maxWidth }}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <HomeTabs {...barProps} />
        <Tabs activeKey={tab} items={items} onChange={setTab} tabBarStyle={{display: 'none'}} />
      </Overlay>
    </div>
  );
}

/**
comment
import React, { useEffect, useState } from 'react';
import { withSize } from 'react-sizeme';
import { useDispatch, useSelector } from 'react-redux';

import { Header } from '../../components/control';
import { Notification } from './Notification';
import { Document } from './Document';
import { getList } from '../../../services';
import { Overlay } from '../../../components/all';
import { Dashboard } from './Dashboard';
import { Update } from './Update';
import moment from 'moment';

function Screen(){
  const [tab, setTab] = useState('review');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notiData, setNotiData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  


 

  

  const headerProps = {tab, setTab, infoCount};
  const notiProps = {data: notiData, error, loading, getData, updateData};
  const dashboardProps = {data: notiData}; 

  return (
    <div className='s_container_r'>
      <Overlay loading={loading}>
        <Header {...headerProps}/>
        {tab === 'review' ? <Dashboard {...dashboardProps}/> : 
        tab === 'setting' ? <Document/> :
        tab === 'notification' ? <Notification {...notiProps}/> :
        tab === 'lastUpdate' ? <Update {...notiProps}/> : ''}
      </Overlay>
    </div>
  );
}

const withSizeHOC = withSize();
export const Control = withSizeHOC(Screen);
 */