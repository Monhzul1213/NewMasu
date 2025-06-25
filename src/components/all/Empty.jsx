import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { IconButton } from "./Button";
import { DynamicBSIcon, DynamicMDIcon } from "./DynamicIcon";

export function Empty(props){
  const { icon, type, onClickAdd, noDescr } = props;
  const { t } = useTranslation();

  return (
    <div className='empty_back'>
      <div className='empty_icon_back'>
        <DynamicMDIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_title'>{t(type + '.title')}</p>
      <p className='empty_descr'>{noDescr ? '' : t(type + '.descr')}</p>
      <IconButton
        className='add_row_btn'
        id='add_row_add'
        text={t(type + '.add')}
        icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />}
        onClick={() => onClickAdd()} />
    </div>
  );
}

export function Empty1(props){
  const { icon, id, text } = props;
  const { t } = useTranslation();

  return (
    <div className='empty_back1' id={id}>
      <div className='empty_icon_back'>
        <DynamicMDIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_descr'>{t(text ?? 'page.no_filter')}</p>
    </div>
  );
}

export function Empty2(props){
  const { icon, type, onClickAdd, onClickImport, noDescr } = props;
  const { t } = useTranslation();

  return (
    <div className='empty_back'>
      <div className='empty_icon_back'>
        <DynamicMDIcon className='empty_icon' name={icon} />
      </div>
      <p className='empty_title'>{t(type + '.title')}</p>
      <p className='empty_descr'>{noDescr ? '' : t(type + '.descr')}</p>
      <IconButton
        className='add_row_btn'
        id='add_row_add'
        text={t(type + '.add')}
        icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />}
        onClick={() => onClickAdd()} />
      <IconButton className='empty_import_btn' text={t('page.import')} onClick={onClickImport} />
    </div>
  );
}

export function CardEmpty(props){
  const { title, icon, route, btn, id, disabled } = props;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClickAdd = () => navigate(route);

  return (
    <div className={id ?? 'ia_back'}>
      <p className='ac_title'>{t(title)}</p>
      <div className='ac_empty_back'>
        <DynamicMDIcon className='ac_empty_icon' name={icon} />
        {!disabled && <IconButton className='empty_btn' text={t(btn)} icon={<DynamicBSIcon name='BsPlusLg' className='em_icon' />} onClick={onClickAdd} />}
      </div>
    </div>
  );
}

export function Empty3(props){
  const { data, icon } = props;

  return data?.length ? null : (
    <div className="empty_back1" style={{ margin: 'auto' }}>
      <div className='empty_icon_back' style={{ marginBottom: 0 }}>
        {icon}
      </div>
    </div>
  );
}