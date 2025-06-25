import React from 'react';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { Radio as AntRadio } from 'antd';
import { useTranslation } from 'react-i18next';

// import '../../css/invt.css';

export function Check(props){
  const { checked, onClick, disabled } = props;

  const onPress = e => {
    if(!disabled) onClick(e);
  }

  return (
    checked
      ? <ImCheckboxChecked className='check_all_btn' id='check_all_selected' onClick={onPress} />
      : <ImCheckboxUnchecked className='check_all_btn' onClick={onPress} />
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
  );
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

export function CheckBox1(props){
  const { label, checked, setChecked, style, disabled, onCheck, className, id } = props;
  const { t } = useTranslation();

  const onClick = () => {
    setChecked(!checked);
    onCheck();
  }

  return (
    <div className={className ?? 'i_check_row'} style={style} id={id ?? 'is_check1'}>
      <Check checked={checked} onClick={onClick} disabled={disabled} />
      <p className='i_check_lbl'>{t(label)}</p>
    </div>
  );
}

export function Radio(props){
  const { value, setValue, inRow, label, data, setError, setEdited, s_value, s_descr, className, disabled } = props;

  const onChange = e => {
    setValue({ value: e.target.value });
    setError && setError(null);
    setEdited && setEdited(true);
  };

  const renderItem = (item, index) => {
    return (<AntRadio key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</AntRadio>);
  }

  const style = value?.error ? { color: '#e41051' } : {};

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={inRow ? { margin: '0 0 0 0', borderColor: 'transparent' } : { borderColor: 'transparent' }}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntRadio.Group className={className ?? 'radio_back'} onChange={onChange} value={value?.value} disabled={disabled}>
          {data?.map(renderItem)}
        </AntRadio.Group>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
};