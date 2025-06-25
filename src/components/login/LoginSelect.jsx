import React, { useEffect, useState } from "react";
import { Radio, Select } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { getConstants } from "../../services";
import { AddInput } from "../all";

export function LoginSelect(props){
  const { value, setValue, setError, setLoading, addItem, setAddItem } = props;
  const { t } = useTranslation();
  const [custom, setCustom] = useState('0');
  const [sales, setSales] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [allData, setAllData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusSales()
    onFocusVendor()
    return () => {};
  }, []);

  const onFocusSales = async () => {
    if(!sales?.length || sales?.length === 1){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getConstants(null, '', 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        setAllData(response?.data);
        let num = [];
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n1 = string.startsWith(1);
          let exists = num?.findIndex(n => n.value === item.valueNum);
          if((n1 === true || string === '199') && exists === -1) num.push({ value: item?.valueNum, label: item?.valueStr1 });
        });
        setSales(num?.sort((a, b) => a.value - b.value));
      }
      setLoading(false);
    }
  }

  const onFocusVendor = async () => {
    if(!vendor?.length || vendor?.length === 1){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getConstants(null, '', 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let num = [];
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n2 = string.startsWith(2);
          let exists = num?.findIndex(n => n.value === item.valueNum);
          if(n2 === true && string !== '199' && exists === -1) num.push({ value: item?.valueNum, label: item?.valueStr1 });
        });
        setVendor(num?.sort((a, b) => a.value - b.value));
      }
      setLoading(false);
    }
  }

  const onChange = e => {
    setCustom(e?.target?.value);
    setValue({ value: null });
    setAddItem({ value: '' });
  }

  const setChange = item => {
    setAddItem({ value: '' });
    setCustom('0');
    setValue({ value: item });
  }

  const setChange1 = item => {
    setAddItem({ value: '' });
    setCustom('1');
    setValue({ value: item });
  }

  const handleEnter = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = allData?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      if(exists === -1){
        setAddItem({ value: valueStr1 });
        toast.success(t('login.success'))
      } else
        setAddItem({ value: addItem?.value?.trim(), error: t('profile.variant_error') });
    }
  }

  let sub1Props = { value: value, setValue: setChange, label: t('profile.sale'), data: sales, onFocus: onFocusSales };
  let sub2Props = { value: value, setValue: setChange1, label: t('profile.vendor'), data: vendor, onFocus: onFocusVendor };

  return (
    <div className='radio_sign_back'>
      <p className='lg_select_lbl_sign'>{t('profile.activity')}</p>
      <Radio.Group className='pro_radio_back' onChange={onChange} value={custom}>
        <Radio className='select_radio_check' value='0'>{t('profile.sale')}</Radio>
        <Radio className='select_radio_check' value='1'>{t('profile.vendor')}</Radio>
      </Radio.Group>
      <div className={(value?.value === 199 || value?.value === 205) ? 'row' : 'col'}>
        <div style={{ overflowY: 'scroll', maxHeight: 150, flex: 1 }}>
          {custom === '0' ? <SubSelect {...sub1Props} /> : <SubSelect {...sub2Props} />}
        </div>
        {(value?.value === 199 || value?.value === 205) &&
          <AddInput
            classBack='lg_input_back1'
            className='lg_m_input'
            value={addItem}
            setValue={setAddItem}
            placeholder={t('login.add_item')}
            handleEnter={handleEnter}
            color='#fff'
            length={100} />
        }
      </div>
      {value?.error && <p className='f_input_error' style={{ color: '#fff' }}>{value?.noLabel ? '' : t('profile.activity')} {value?.error}</p>}
    </div>
  );
}

const SubSelect = props => {
  const { value, setValue, data, onFocus } = props;
  const { t } = useTranslation();

  return (
    <div className='lg_radio_select_back_z'>
      <Select
        options={data}
        className='lg_select_login'
        onChange={setValue}
        value={value?.value}
        placeholder={t('profile.activity1')}
        onFocus={() => onFocus && onFocus()} />
    </div>
  );
}