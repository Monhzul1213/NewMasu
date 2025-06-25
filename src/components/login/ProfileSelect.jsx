import React, { useEffect, useState } from "react";
import { Radio, Select } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;

import '../../css/login.css';
import { getConstants } from "../../services";
import { AddInput } from "../all";

export function ProfileRadio(props){
  const { value, setValue, merchant, addItem, setAddItem, setEdited, setError, setLoading } = props;
  const { t } = useTranslation();
  const [custom, setCustom] = useState('0');
  const [sales, setSales] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [allData, setAllData] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let s = merchant?.merchantSubType?.toString()
    if(s?.startsWith(1) || merchant?.merchantSubType === null || merchant === undefined) setCustom('0') 
    else setCustom('1')
    return () => {};
  }, []);

  useEffect(() => {
    onFocusSales()
    onFocusVendor()
    return () => {};
  }, []);

  const onChange = e => {
    setCustom(e?.target?.value);
    setValue({ value: null });
    setAddItem({ value: '' });
  }

  const setChange = item => {
    setAddItem({ value: '' });
    setCustom('0');
    setValue({ value: item });
    setEdited && setEdited(true);
  }

  const setChange1 = item => {
    setAddItem({ value: '' });
    setCustom('1');
    setValue({ value: item });
    setEdited && setEdited(true);
  }

  const onFocusSales = async () => {
    if(!sales?.length || sales?.length === 1){
      setError && setError(null);
      setLoading && setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        setAllData(response?.data);
        let num = [];
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n1 = string.startsWith(1);
          let exists = num?.findIndex(n => n.value === item.valueNum);
          if(n1 === true && exists === -1) num.push({...item});
        });
        setSales(num?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading && setLoading(false);
    }
  }

  const onFocusVendor = async () => {
    if(!vendor?.length || vendor?.length === 1){
      setError && setError(null);
      setLoading && setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msMerchant_SubType'));
      if(response?.error) setError && setError(response?.error);
      else {
        let num = [] ;
        response?.data?.forEach(item => {
          let string = item?.valueNum?.toString();
          let n2 = string.startsWith(2);
          let exists = num?.findIndex(n => n.value === item.valueNum);
          if(n2 === true && exists === -1) num.push({...item});
        });
        setVendor(num?.sort((a, b) => a.valueNum - b.valueNum));
      }
      setLoading && setLoading(false);
    }
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

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};
  const sub1Props = { value: value, setValue: setChange, label: t('profile.sale'), placeholder: t('profile.activity1'), data: sales, onFocus: onFocusSales };
  const sub2Props = { value: value, setValue: setChange1, label: t('profile.vendor'), placeholder: t('profile.activity1'), data: vendor, onFocus: onFocusVendor };

  return (
    <div className='radio_back'>
      <p className='select_lbl' style={style}>{t('profile.activity')}</p>
      <Radio.Group className='pro_radio' onChange={onChange} value={custom}>
        <Radio value='0'>{t('profile.sale')}</Radio>
        <div className="gap" />
        <Radio value='1'>{t('profile.vendor')}</Radio>
      </Radio.Group>
      <div className={(value?.value === 199 || value?.value === 205) ? 'row' : 'col'}>
        <div className='list_scroll' style={{overflowY: 'scroll', maxHeight: 150, flex: 1}}>
          {custom === '0' ? <SubSelect {...sub1Props} /> : <SubSelect {...sub2Props} />}
        </div>
        {(value?.value === 199 || value?.value === 205) &&
          <div style={{flex: 1, marginLeft: 10}}>
            <AddInput
              classBack='select_back1'
              value={addItem}
              setValue={setAddItem}
              placeholder={t('login.add_item')}
              handleEnter={handleEnter}
              length={100} />
          </div>
        }
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : t('profile.activity')} {value?.error}</p>}
    </div>
  );
}

const SubSelect = props => {
  const { value, setValue, data, placeholder, onFocus } = props;
  const { t } = useTranslation();

  const renderItem = (item, index) => {
    return (<Option key={index} value={item['valueNum']} label={item['valueStr1']}>{item['valueStr1']}</Option>);
  }

  return (
    <div className='select_back1'>
      <Select
        className='select_m'
        onChange={setValue}
        value={value?.value}
        placeholder={placeholder}
        onFocus={() => onFocus && onFocus()}>
        {data?.map(renderItem)}
      </Select>
    </div>
  );
}

export function ProfileSelect(props){
  const { value, setValue, setEdited, addItem, setAddItem, setError, setLoading } = props;
  const { t } = useTranslation();
  const [markets, setMarkets] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    onFocusMarket()
    return () => {};
  }, []);

  const onFocusMarket = async () => {
    if(!markets?.length || markets?.length === 1){
      setError && setError(null);
      setLoading && setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msMerchant_AdsType'));
      if(response?.error) setError && setError(response?.error);
      else setMarkets(response?.data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading && setLoading(false);
    }
  }

  const setChange = item => {
    setAddItem({ value: '' });
    setValue({ value: item });
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let valueStr1 = addItem?.value?.trim();
    if(valueStr1){
      let exists = markets?.findIndex(d => d.valueStr1?.toLowerCase() === valueStr1?.toLowerCase());
      if(exists === -1){
        setAddItem({ value: valueStr1 });
        toast.success(t('login.success'))
      } else
        setAddItem({ value: addItem?.value?.trim(), error: t('profile.variant_error') });
    }
  }
  
  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : { color: '#e41051' };
  const sub1Props = { value, setValue: setChange, data: markets, onFocus: onFocusMarket, placeholder: t('profile.question') };

  return (
    <div className='radio_back'>
      <p className='select_lbl' style={style}>{t('profile.question')}</p>
      <div className={value?.value === 200 ? 'row' : 'col'}>
        <div className='list_scroll' style={{overflowY: 'scroll', maxHeight: 150, flex: 1}}>
          <SubSelect {...sub1Props}/>
        </div>
        {value?.value === 200 && 
          <div style={{flex: 1, marginLeft: 10}}>
            <AddInput
              classBack='select_back1'
              value={addItem}
              setValue={setAddItem}
              placeholder={t('login.add_item')}
              handleEnter={handleEnter}
              length={100} />
          </div>
        }
      </div>
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : t('profile.question')} {value?.error}</p>}
    </div>
  );
}