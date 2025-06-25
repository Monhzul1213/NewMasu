import React from "react";
import { useTranslation } from "react-i18next";

export function HomeTabs(props){
  const { tab, setTab, infoCount } = props;
  const { t } = useTranslation();

  const Tab = ({ label, count }) => {
    const active = label === tab;
    return (
      <div className={`co_card ${active ? 'active' : ''}`} onClick={() => setTab(label)}>
        <p className={`co_card_label ${active ? 'active' : ''}`}>{t('home.' + label)}</p>
        {count ? <span className="notification-badge">{count}</span> : null}
      </div>
    );
  };

  return (
    <div className='dashboard_header_back'>
      <Tab label='dashboard' />
      <Tab label='settings' />
      <Tab label='info' count={infoCount} />
      <Tab label='version'/>
    </div>
  );
}