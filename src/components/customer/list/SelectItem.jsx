import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { getList } from '../../../services';
import { CustomSelect, Overlay } from '../../all';
import { useDebounce } from '../../../helpers';
const { Option } = Select;

export function SelectItem(props){
  const { item } = props;

  return (
    <div className='cs_item'>
      <p className='cs_name'>{item?.custName ?? item?.descr ?? item?.invtName}</p>
    </div>
  );
}
export function CustomerSelectItem(props){
  const { search, setSearch, data, setData, newItem, disabled } = props;
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData(text);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const getData = async () => {
    // if(value ){
      setLoading(true);
      setSearch({ value: null });
      let headers = {CustID: -1};
      let response = await dispatch(getList(user, token, 'Site/GetCustomer', null,  headers))
      if(response?.error) setSearch({ value: null, error: response?.error });
      else {
        setItems(response?.data?.customers);
      }
      setLoading(false);
    // }
  }

  const onSelect = value => {
    let invt = items[value?.value];
    let exists = data?.findIndex(d => d.custId === invt?.custId);
    if(exists === -1){
      let item = newItem(invt);
      setData(old => [...old, item]);
      setSearch({ value: null });
    } else {
      setSearch({ value: null, error: t('customer.already_added') });
    }
  }

  const renderItem = (item, index) => {
    let optItem = { custName: item?.custName };
    return (
      <Option key={index} value={index} name={optItem?.custName}>
        <SelectItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  const selectProps = { value: search, setValue: onSelect, placeholder: t('customer.add'), data: items,
    className: 'kit_select', classBack: 'kit_search', renderItem, filterOption, onSearch: setText, text, setData: setItems, disabled};

  return (
    <Overlay loading={loading}>
      <CustomSelect {...selectProps} />
    </Overlay>
  );
}