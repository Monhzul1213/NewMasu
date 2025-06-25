import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { lock } from '../../assets';
import { Button } from "../all";

export function Bottom(){
  const { t } = useTranslation();
  const collapsed = useSelector(state => state.temp.collapsed);
  
  const style = {
    transition: 'width 0.2s ease-in, height 0.2s ease-in, padding 0.2s ease-in',
    width: collapsed ? 52 : 280,
    height: collapsed ? 52 : 178,
    padding: collapsed ? 5 : 10,
  };

  const onClick = () => {
    // comment
    console.log('extend subscription');
  }

  return (
    <div className="bt_back" style={style}>
      <img className="bt_icon" src={lock} onClick={onClick} />
      {!collapsed && <p className="bt_text">{t('menu.info')}</p>}
      {!collapsed && <Button text={t('menu.extend')} className='bt_btn' onClick={onClick} />}
    </div>
  );
}