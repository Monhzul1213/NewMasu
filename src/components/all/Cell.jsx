import React, { useEffect, useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import CurrencyInput from "react-currency-input-field";
import { Date } from "./Date";
import moment from "moment";

const { Option } = Select;

export function CellMoney(props){
  const { cellID, disabled, minWidth, width, getValue, row: { index, original }, column: { id }, table } = props;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const user = useSelector(state => state.login?.user);
  const suffix = user?.msMerchant?.currency ?? '';
  const hasError = original?.error === id;
  const notEditable = (table?.options?.meta?.disabled || disabled) && !hasError;
  const width1 = minWidth ? (minWidth - 18) : width;

  useEffect(() => {
    setValue(initialValue);
    return () => {};
  }, [initialValue, original?.edited]);

  const onBlur = e => {
    table?.options?.meta?.updateMyData(index, id, value, e);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur(); 
  }

  const onFocus = e => {
    if(e?.target?.value === '0') setValue('');
  }

  const errorStyle = hasError ? { borderColor: '#e41051' } : {};
  const style = {...{ textAlign: 'right', width: width1 }, ...errorStyle};

  return (
    <CurrencyInput
      className='ed_input'
      id={cellID}
      suffix={suffix}
      allowNegativeValue={false}
      decimalsLimit={4}
      maxLength={15}
      value={value}
      onValueChange={setValue}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      style={style}
      disabled={notEditable} />
  );
}

export function CellQty(props){
  const { cellID, disabled, minWidth, width, getValue, row: { index, original }, column: { id }, table } = props;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const hasError = original?.error === id;
  const notEditable = (table?.options?.meta?.disabled || disabled) && !hasError;
  const width1 = minWidth ? (minWidth - 18) : width;

  useEffect(() => {
    setValue(initialValue);
    return () => {};
  }, [initialValue, original?.edited]);

  const onBlur = e => {
    table?.options?.meta?.updateMyData(index, id, value, e);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur(); 
  }

  const onFocus = e => {
    if(e?.target?.value === '0') setValue('');
  }

  const errorStyle = hasError ? { borderColor: '#e41051' } : {};
  const style = {...{ textAlign: 'right', width: width1 }, ...errorStyle};

  return (
    <CurrencyInput
      className='ed_input'
      id={cellID}
      allowNegativeValue={false}
      disableGroupSeparators={true}
      decimalsLimit={2}
      maxLength={15}
      value={value}
      onValueChange={setValue}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      style={style}
      disabled={notEditable} />
  );
}

export function CellSelect(props){
  const { width, disabled, data, s_value, s_descr, getValue, row: { index }, column: { id }, table, placeholder } = props;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
    return () => {};
  }, [initialValue]);

  const onChange = value => {
    table?.options?.meta?.updateMyData(index, id, value);
  }

  const renderItem = (item, index) => {
    return (<Option key={index} value={item[s_value ?? 'value']}>{item[s_descr ?? 'label']}</Option>);
  }

  return (
    <div className='ed_select_back' style={{ width }}>
      <Select
        className='ed_select'
        showSearch
        style={{ width }}
        disabled={table?.options?.meta?.disabled || disabled}
        filterOption={(input, option) => option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        value={value}
        placeholder={placeholder}
        onChange={onChange}>
        {data?.map(renderItem)}
      </Select>
    </div>
  );
}

export function CellInput(props){
  const { cellID, disabled, minWidth, width, getValue, row: { index, original }, column: { id, columnDef: { meta } }, table } = props;
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);
  const hasError = original?.error === id;
  const notEditable = (table?.options?.meta?.disabled || disabled) && !hasError;
  const width1 = minWidth ? (minWidth - 18) : width;

  useEffect(() => {
    setValue(initialValue);
    return () => {};
  }, [initialValue, original?.edited]);

  const onChange = e => {
    let notValid = e?.target?.value?.includes("'");
    if(notValid) setValue(value);
    else if(e?.target?.value?.length > meta?.length) setValue(value);
    else setValue(e.target.value);
  }

  const onBlur = e => {
    table?.options?.meta?.updateMyData(index, id, value, e);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur(); 
  }

  const errorStyle = hasError ? { borderColor: '#e41051' } : {};
  const style1 = {...{ width: width1 }, ...errorStyle};

  return (
    <input
      className='ed_input'
      id={cellID}
      style={width ? style1 : errorStyle}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      disabled={notEditable} />
  );
}

export const CellDate = (props) => {
  const { cellID, disabled, minWidth, width, getValue, row: { index, original }, column: { id, columnDef: { meta } } } = props;
  const initialValue = getValue();
  const [date, setDate] = useState(moment(initialValue));

  useEffect(() => {    
    setDate(initialValue ? moment(initialValue) : moment());
  }, [initialValue]);

  const onBlur = (e) => {
    updateMyData(index, id, date ? date.format("YYYY.MM.DD") : null, e);
  };

  const onKeyDown = (e) => {
    if (e?.key?.toLowerCase() === "enter") {
      updateMyData(index, id, date ? date.format("YYYY.MM.DD") : null, e);
    }
  };

  const dateProps = {
    value: { value: date },
    setValue: (v) => setDate(v.value), 
    inRow: true, isPad: true,
    disabledDate: meta?.disabledDate,
    className: "item_cell_date",
    onBlur,
    onKeyDown,
    disabled, 
    id: cellID,
    suffixIcon: null
  };

  return <Date {...dateProps} />;
};

export function CellItem(props){
  const { item, label } = props;

  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.name ?? item?.descr ?? item?.invtName}</p>
      {/* <p className='cs_sku'>{label ?? 'SKU'} {item?.sku ?? item?.invtId}</p> */}
    </div>
  );
}