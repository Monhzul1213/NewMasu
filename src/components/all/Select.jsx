import React, { useState } from "react";
import { Select as AntSelect } from 'antd';
import { BsCheckLg } from "react-icons/bs";
import { useTranslation } from "react-i18next";

import { bank_icons } from "../../assets/banks";
import { CheckBox1 } from "./Check";

const { Option } = AntSelect;
export function PlainSelect(props){
  const { classBack, bStyle, Icon, label, classLabel, className, value, setValue, loading, onFocus, placeholder, data, s_value, s_descr } = props;

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  return (
    <div className={classBack} style={bStyle}>
      {Icon && <Icon />}
      {label && <p className={classLabel ?? 'p_select_lbl'}>{label}</p>}
      <AntSelect
        className={className}
        showSearch
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        value={value}
        onChange={setValue}
        loading={loading}
        onFocus={onFocus}
        placeholder={placeholder}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}

export function Select(props){
  const { inRow, inRow1, className, id, data, value, setValue, label, mode, loading, disabled, setError, setEdited, onFocus, placeholder, s_value, s_descr } = props;
  const { t } = useTranslation();

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const backStyle = inRow ? {...style, ...{ margin: '0 0 0 0' }} : style;
  let maxTagPlaceholder = value?.value?.length === data?.length ? t('page.pay_shop3') : (value?.value?.length + t('page.pay_shop4'));

  return (
    <div style={inRow ? inRow1 ? { flex: 1, maxWidth: 300 } : {flex: 1} : {}}>
      <div className={className ?? 'select_back'} style={backStyle} id={id}>
        <p className='select_lbl' style={style}>{label}</p>
        <AntSelect
          mode={mode}
          loading={loading}
          disabled={disabled}
          className='select_m'
          showSearch
          filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          onChange={handleChange}
          value={value?.value}
          onFocus={() => onFocus && onFocus()}
          maxTagCount={0}
          maxTagPlaceholder={maxTagPlaceholder}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function CustomSelect(props){
  const { value, setValue, placeholder, data, className, classBack, label, onFocus, loading, renderItem, filterOption, setError, setEdited, onSearch, text, setData,
    disabled } = props;
  const { t } = useTranslation();

  const handleChange = e => {
    setValue({ value: e });
    setError && setError(null);
    setEdited && setEdited(true);
  }

  const onDropdownVisibleChange = show => {
    // if(!show) setData && setData([]);
  }

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  // const empty = t(text?.length > 3 ? 'page.no_filter' : 'inventory.morethan');
  
  return (
    <div className={classBack}>
      <div className='input_border' style={style}>
        {label && <p className='p_select_lbl' style={style}>{label}</p>}
        <AntSelect
          className={className}
          showSearch
          filterOption={filterOption}
          disabled={disabled}
          onSearch={onSearch}
          onChange={handleChange}
          value={value?.value}
          loading={loading}
          onOpenChange={onDropdownVisibleChange}
          onFocus={onFocus}
          // notFoundContent={empty}
          placeholder={placeholder}>
          {data?.map(renderItem)}
        </AntSelect>
      </div>
      {value?.error && <p className='f_input_error'>{label} {value?.error}</p>}
    </div>
  );
}

export function BankSelect(props){
  const { label, value, setValue, data } = props;

  const renderItem = (item, index) => {
    return (
      <Option key={index} value={index}>
        <div style={{display: 'flex', flexFlow: 'row', alignItems: 'center'}}>
          <img className='pay_select_icon' src={bank_icons[item?.logo]} alt={item?.bank} />
          {item?.label}
        </div>
      </Option>
    );
  }

  return (
    <div className='pay_field_back'>
      <p className='pay_field_label'>{label}</p>
      <AntSelect
        className='pay_select'
        onChange={setValue}
        value={value}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}

export function MultiSelect(props){
  const { classBack, classLabel, className, Icon, label, label1, data, value, setValue, loading, onFocus, onHide, placeholder, s_value, s_descr, width } = props;
  const { t } = useTranslation();
  const [checked, setChecked] = useState(true);
  const maxTag = (value?.length === data?.length ? t('page.all1') : value?.length) + label1;

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  const onCheck = () => {
    if(!checked) {
      let all = data?.map(item => item[s_value ?? 'value']);
      setValue(all);
    } else
      setValue([]);
  }

  const onChange = value1 => {
    setValue(value1);
    setChecked(value1?.length === data?.length);
  }

  const onDropdownVisibleChange = show => {
    if(!show) onHide();
  }

  const dropdownRender = menu => {
    return (
      <>
        <CheckBox1 className='multi_btn' label={t('page.all')} checked={checked} setChecked={setChecked} onCheck={onCheck} />
        {menu}
      </>
    );
  }

  return (
    <div className={classBack} style={{ width }}>
      {Icon && <Icon />}
      {label && <p className={classLabel ?? 'ih_select_lbl'}>{label}</p>}
      <AntSelect
        className={className}
        showSearch
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        value={value}
        onChange={onChange}
        loading={loading}
        onFocus={onFocus}
        mode='multiple'
        menuItemSelectedIcon={<BsCheckLg />}
        onOpenChange={onDropdownVisibleChange}
        popupRender={dropdownRender}
        maxTagCount={0}
        maxTagPlaceholder={maxTag}
        placeholder={placeholder}>
        {data?.map(renderItem)}
      </AntSelect>
    </div>
  );
}