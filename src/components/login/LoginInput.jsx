import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { DynamicAIIcon } from "../all";

export function LoginInput(props){
  const { t } = useTranslation();
  const { text, value, setValue, setError, handleEnter, id, disabled, length, isLogin, Icon, className, color, classBack } = props;

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onBlur = () => {
    !id && setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1].focus();
          e.preventDefault();
        }
      }
    }
  }

  const style = value?.error ? { borderColor: color ?? '#e41051' } : {};

  return (
    <div className='f_input_container' id={id}>
      <div className={classBack ?? 'lg_input_container'}>
        {Icon && <Icon />}
        <input
          className={className ?? 'f_input_back1'}
          style={style}
          value={value?.value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={text}
          disabled={disabled}
          name={isLogin ? '' : 'notsearch_password'} />
      </div>
      {value?.error && <p className='f_input_error' style={{ color }}>{value?.noLabel || id ? '' : text} {value?.error}</p>}
    </div>
  );
}

export function LoginPassword(props){
  const { text, value, setValue, setError, handleEnter, isLogin, className, classIcon, classShow, color, classBack } = props;
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onClick = e => {
    e.preventDefault();
    setVisible(!visible);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1].focus();
          e.preventDefault();
        }
      }
    }
  }

  const onBlur = () => {
    setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const style = value?.error ? { borderColor: color ?? '#e41051' } : {};

  return (
    <div className='f_input_container'>
      <div className={classBack ?? 'lg_input_container'}>
        <DynamicAIIcon className={classIcon ?? 'f_input_icon'} name='AiOutlineLock' />
        <input
          className={className ?? 'f_input_back1'}
          style={style}
          value={value?.value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          placeholder={text}
          id={visible ? null : 'm_input_password'}
          name={isLogin ? '' : 'notsearch_password'} />
        <DynamicAIIcon className={classShow ?? 'f_input_show'} name={visible ? 'AiOutlineEye' : 'AiOutlineEyeInvisible'} onClick={onClick} />
      </div>
      {value?.error && <p className='f_input_error' style={{ color }}>{value?.noLabel ? '' : text} {value?.error}</p>}
    </div>
  )
}

export function LoginInput1(props){
  const { t } = useTranslation();
  const { text, value, setValue, setError, handleEnter, id, disabled, length, isLogin } = props;

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid)
      setValue({ value: value?.value, error: ' ' + t('error.valid_character'), noLabel: true })
    else if(e?.target?.value?.length > length)
      setValue({ value: value?.value, error: ' ' + length + t('error.shorter_than') })
    else 
      setValue({ value: e.target.value });
    setError && setError(null);
  }

  const onBlur = () => {
    !id && setValue({ value: value?.value?.trim(), error: value?.error, noLabel: value?.noLabel });
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      if(handleEnter) handleEnter(e);
      else {
        const form = e.target.form;
        if(form){
          const index = [...form].indexOf(e.target);
          form.elements[index + 1].focus();
          e.preventDefault();
        }
      }
    }
  }

  const style = value?.error ? { borderColor: '#e41051' } : {};
  const style1 = value?.error ? { color: '#e41051' } : {};
  const inputProps = { className: 'f_input_back', value: value?.value, onChange, onKeyDown, style, onBlur, placeholder: text, disabled };

  return (
    <div className='f_input_container' id={id}>
      <label className='f_input_label' style={style1}>{text}</label>
      <input {...inputProps} name={isLogin ? '' : 'notsearch_password'} />
      {value?.error && <p className='f_input_error'>{value?.noLabel || id ? '' : text} {value?.error}</p>}
    </div>
  );
}