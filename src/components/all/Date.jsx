import React from "react";
import { DatePicker } from "antd";
import InputMask from "@mona-health/react-input-mask";
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

const MyDatePicker = DatePicker.generatePicker(momentGenerateConfig);
const { RangePicker } = MyDatePicker;

export function PlainRange(props){
  const { classBack, label, className, value, disabled, setValue, placeholder, onHide, width } = props;

  const onChange = value1 => {
    setValue(value1);
    onHide(value1);
  }

  return (
    <div className={classBack} style={{ width }}>
      {label && <p className='ih_select_lbl'>{label}</p>}
      <RangePicker
        className={className}
        suffixIcon={null}
        allowClear={false}
        placeholder={placeholder}
        value={value}
        format='YYYY.MM.DD'
        disabled={disabled}
        onChange={onChange} />
    </div>
  );
}

export function Date(props){
  const { inRow, value, setValue, label, setError, className, disabled, disabledDate, setEdited, allowClear, placeholder, classBack, suffixIcon } = props;

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0', padding: '0 0 0 0' }} : style;

  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className= {classBack ?? 'select_back'} style={backStyle}>
        {label &&<p className='select_lbl' style={style}>{label}</p>}
        <MyDatePicker
          className={className ?? 'm_date'}
          value={value?.value}
          disabled={disabled}
          format='YYYY.MM.DD'
          placeholder={placeholder ?? ''}
          allowClear={allowClear ?? false}
          disabledDate={disabledDate}
          onChange={handleChange} 
          suffixIcon={suffixIcon}/>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function Time(props){
  const { inRow, disabled, value, setValue, handleEnter, setError, setEdited, label, onTime } = props;

  const onChange = e => {
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
    let length = value?.value?.replace(/[-:]/g, '')?.length;
    if(length !== 0 && length !== 6) setValue({ value: value?.value?.replace(/-/g, '0') });
    onTime && onTime(length ? { value: value?.value?.replace(/-/g, '0') } : null);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;
  const startsWithTwo = value?.value && value?.value[0] === '2';
  const mask = [/[0-2]/, startsWithTwo ? /[0-3]/ : /[0-9]/, ':', /[0-5]/, /[0-9]/, ':', /[0-5]/, /[0-9]/];
  
  return (
    <div style={inRow ? { flex: 1 } : {}}>
      <div className='select_back' style={backStyle}>
        <p className='select_lbl' style={style}>{label}</p>
        <InputMask
          className='m_input'
          mask={mask}
          style={{width: '100%'}}
          disabled={disabled}
          maskPlaceholder='-'
          onKeyDown={onKeyDown}
          placeholder='hh:mm:ss'
          onBlur={onBlur}
          value={value?.value}
          onChange={onChange} />
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}