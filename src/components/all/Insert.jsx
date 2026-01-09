import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

// import '../../css/invt.css';
import { sendRequest } from '../../services';
import { useDebounce } from '../../helpers';
import { Overlay } from "./Loader";
import { CustomSelect } from './Select';
import { CellItem } from './Cell';
const { Option } = Select;

export function Insert(props){
  const { search, setSearch, data, setData, makeNewItem } = props;
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useDebounce();
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData(text);
    return () => {};
  }, [text]);

  const getData = async value => {
    if(value?.length > 1){
      setLoading(true);
      setSearch({ value: null });
      let filter = [{ fieldName: "Name", value }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      if(response?.error) setSearch({ value: null, error: response?.error });
      else setItems(response?.data);
      setLoading(false);
    }
  }

  const onSelect = value => {
    let invt = items && items[value?.value]?.msInventory;
    let exists = data?.findIndex(d => d.invtId === invt?.invtId);
    if(exists === -1){
      let item = makeNewItem(invt);
      setData(old => [...old, item]);
      setSearch({ value: null });
    } else {
      setSearch({ value: null, error: t('inventory.already_added') });
    }
  }

  const renderItem = (item, index) => {
    let optItem = { name: item?.msInventory?.name, sku: item?.msInventory?.sku };
    return (
      <Option key={index} value={index} name={optItem?.name} sku={optItem?.sku}>
        <CellItem item={optItem} />
      </Option>
    );
  }

  const filterOption = (input, option) => {
    return option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option?.sku?.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  return (
    <Overlay loading={loading}>
      <CustomSelect
        placeholder={t('inventory.search')}
        value={search}
        setValue={onSelect}
        data={items}
        setData={setItems}
        renderItem={renderItem}
        filterOption={filterOption}
        text={text}
        onSearch={setText}
        className='kit_select' classBack='kit_search' />
    </Overlay>
  );
}