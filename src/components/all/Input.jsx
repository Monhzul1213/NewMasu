import React, { useEffect, useRef, useState } from "react";
import { AutoComplete } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CurrencyInput from 'react-currency-input-field';
import ReactInputMask from "@mona-health/react-input-mask";

import { DynamicAIIcon, DynamicMDIcon } from "./DynamicIcon";
import { timeList1 } from "../../helpers";

export function AddInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, length, noBlur, className, classBack, color } = props;
  const { t } = useTranslation();

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    !noBlur && setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className={classBack ?? 'input_back1'} style={backStyle}>
        <input
          className={className ?? 'm_input'}
          disabled={disabled}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error' style={{ color }}>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function Input(props){
  const { inRow, inRow1, classBack, className, value, setValue, label, placeholder, disabled, handleEnter, noBlur, length, setError, setEdited } = props;
  const { t } = useTranslation();

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    if (!noBlur && typeof value?.value === 'string') {
      const trimmed = value.value.trim();
      if (trimmed !== value.value) {
        setValue({ value: trimmed, error: value?.error, noLabel: value?.noLabel });
      }
    }
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? inRow1 ? {flex: 1,  maxWidth: 300 } : {flex: 1} : {}}>
      <div className={classBack ?? 'select_back'} style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <input
          className={className ?? 'm_input'}
          disabled={disabled}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function MoneyInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, onBlur } = props;
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';

  const onChange = value => {
    setValue({ value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <CurrencyInput
          className='m_input'
          suffix={suffix}
          allowNegativeValue={false}
          disabled={disabled}
          placeholder={placeholder}
          decimalsLimit={4}
          value={value?.value}
          maxLength={15}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onValueChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function DescrInput(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, inRow, length, id, id_back, classBack, className } = props;
  const { t } = useTranslation();

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className={classBack ?? 'select_back'} style={backStyle} id={id_back}>
        <p className='select_lbl' style={style}>{label}</p>
        <textarea
          id={id}
          className={className ?? 'm_input_descr'}
          disabled={disabled}
          placeholder={placeholder}
          value={value?.value}
          onBlur={onBlur}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function InputPassword(props){
  const { value, setValue, label, placeholder, disabled, setError, setEdited, handleEnter, inRow, length } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    setEditable(!disabled);
    return () => {};
  }, [disabled]);

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
  }

  const onClickLock = e => {
    e.preventDefault();
    setEditable(true);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1, position: 'relative' } : { position: 'relative' }}>
      <div className='select_back' style={backStyle}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <input
          className='m_input'
          disabled={!editable}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          value={editable ? value?.value : '********'}
          id={visible ? null : 'm_input_password'}
          onChange={onChange} />
      </div>
      {editable
        ? <DynamicAIIcon className='m_input_show' name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
        : <DynamicAIIcon className='m_input_show' name='AiOutlineLock' onClick={onClickLock} />
      }
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function TimeInput(props){
  const { handleEnter, placeholder, value, setValue, label, style } = props;
  const [open, setOpen] = useState(false);

  const handleSearch = data => setValue({ value: data });

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1]?.focus();
          e.preventDefault();
        }
      }
    }
  }

  const onSelect = val => {
    setValue({ value: val });
    setOpen(false);
  };

  const onChange = e => setValue({ value: e });
  const onClick = e => setOpen(true);

  const onBlur = () => {
    let length = value?.value?.replace(/[-.]/g, '')?.length;
    if(length !== 0 && length !== 5) setValue({ value: value?.value?.replace(/-/g, '0') });
  }
  
  const style1 = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div className='invt_time_back'>
      {label && <p className='select_lbl_i' style={style1}>{label}</p>}
      <AutoComplete
        onKeyDown={onKeyDown}
        allowClear 
        filterOption={(inputValue, option) => option.value.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0 }
        style={style}
        onSearch={handleSearch}
        className='invt_select'
        onSelect={onSelect}
        onChange={onChange}
        open={open}
        placeholder={placeholder}
        value={value?.value}
        options={timeList1}>
        <ReactInputMask
          className='m_input'
          maskPlaceholder='-'
          placeholder='--:--'
          mask='99:99'
          onBlur={onBlur} />
      </AutoComplete>
      <DynamicMDIcon size={18} name='MdOutlineKeyboardArrowDown' className='tm_select_icon' onClick={onClick} />
    </div>
  );
}