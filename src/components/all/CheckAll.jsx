import React from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

export function Check(props){
  const { checked, onClick, disabled } = props;

  const onPress = () => {
    if(!disabled) onClick();
  }

  return (
    checked
      ? <ImCheckboxChecked className='check_all_btn' id='check_all_selected' onClick={onPress} />
      : <ImCheckboxUnchecked className='check_all_btn' onClick={onPress} />
  );
}

export function CheckBtn(props){
  const { checked, onClick, disabled, className } = props;

  return (
    <button className={className ?? 'check_btn'} onClick={onClick} disabled={disabled}>
      {checked
        ? <ImCheckboxChecked className='check_btn_icon' id='check_all_selected' />
        : <ImCheckboxUnchecked className='check_btn_icon' />}
    </button>
  );
}

export function CheckBtn1(props){
  const { checked, onClick, disabled, className } = props;

  return (
    <div className={className ?? 'check_btn'} onClick={onClick} disabled={disabled}>
      {checked
        ? <ImCheckboxChecked className='check_btn_icon' id='check_all_selected' />
        : <ImCheckboxUnchecked className='check_btn_icon' />}
    </div>
  );
}
export function CheckAll(props){
  const { type, checked, onCheckAll, style } = props;
  const { t } = useTranslation();

  const onClick = () => {
    onCheckAll && onCheckAll(!checked);
  }

  return (
    <div className='check_all' style={style}>
      <Check checked={checked} onClick={onClick} />
      <p className='check_all_lbl'>{t(type + '.check_lbl')}</p>
    </div>
  )
}

export function CheckBox(props){
  const { label, checked, setChecked, style, disabled, id } = props;
  const { t } = useTranslation();

  const onClick = () => {
    setChecked(!checked);
  }

  return (
    <div className='i_check_row' style={style} id={disabled ? 'i_check_disabled' : ''}>
      <Check checked={checked} onClick={onClick} disabled={disabled} />
      <p className='i_check_lbl' id={id}>{t(label)}</p>
    </div>
  );
}