import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getList } from "../../../../services";
import { Button, ButtonRowAdd, InventoryExcel, PlainSelect, Search1 } from "../../../all";

export function InventoryFilter(props){
  const { pgWidth, show, columns, data, cats, onClickAdd, onClickDelete, onClickImport, onSearch, setError, vendors } = props;
  const { t } = useTranslation();
  const [site, setSite] = useState(-1);
  const [sites, setSites] = useState([{ siteId: -1, name: t('page.all_site') }]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(-2);
  const [categories, setCategories] = useState([{ categoryId: -2, categoryName: t('inventory.all_category') }]);
  const [vends, setVends] = useState([{vendId: -3, vendName: t('bill.all_vendor')}]);
  const [vend, setVend] = useState(-3);
  const [search, setSearch] = useState('');
  const [width, setWidth] = useState({ });
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(pgWidth >= 1240) setWidth({ search: 400, picker: 162 });
    else if(pgWidth < 1240 && pgWidth >= 1090) setWidth({ search: pgWidth - 840, picker: 162 });
    else if(pgWidth < 1090 && pgWidth >= 766) setWidth({ search: pgWidth - 516, picker: 162 });
    else if(pgWidth < 766 && pgWidth >= 594) setWidth({ search: pgWidth - 344, picker: 162 });
    else if(pgWidth < 594 && pgWidth >= 422) setWidth({ search: pgWidth - 172, picker: 162 });
    else if(pgWidth < 422) setWidth({ search: pgWidth, picker: (pgWidth - 10) / 2 });
    return () => {};
  }, [pgWidth]);

  const onFocusSite = async () => {
    if(!sites?.length || sites?.length === 1){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getList(user, token, 'Site/GetSite'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [...[{ siteId: -1, name: t('page.all_site' )}], ...response?.data];
        setSites(data);
      }
      setLoading(false);
    }
  }

  const onFocusCategory = async () => {
    if(!categories?.length || categories?.length === 1){
      setCategories([...[{categoryId: -2, categoryName: t('inventory.all_category')}], ...cats])
    }
  }

  const onFocusVendor = async () => {
    if(!vends?.length || vends?.length === 1){
      setVends([...[{vendId: -3, vendName: t('bill.all_vendor')}], ...vendors])
    }
  }

  const onChangeSite = value => {
    setSite(value);
    onHide(value, category, search, vend);
  }

  const onChangeCategory = value => {
    setCategory(value);
    onHide(site, value, search, vend);
  }

  const onChangeVendor = value => {
    setVend(value);
    setFilter(site, category, search, value);
  }

  const handleEnter = value => onHide(site, category, value, vend);

  const onHide = (site1, cat1, name1, vend1) => {
    let data = [];
    if(site1 !== -1) data.push({ fieldName: 'SiteID', value: site1 });
    if(cat1 !== -2) data.push({ fieldName: 'CategoryID', value: cat1 });
    if(vend1 !== -3) data.push({ fieldName: 'VendID', value: vend1 });
    if(name1) data.push({ fieldName: 'Name', value: name1 });
    onSearch(data);
  }
  
  const id = pgWidth > 1090 ? 'ih_large' : 'ih_small';
  const addProps = { show, onClickAdd, onClickDelete };
  const excelWidth = [{ wpx: 400 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 }, { wpx: 70 } ];
  const selectProps = { classBack: 'filter_select_back', classLabel: 'ih_select_lbl', className: 'filter_select', bStyle: { width: width?.picker } };

  return (
    <div id={id} style={{position: 'relative'}}>
      <div className='ih_header'>
        <ButtonRowAdd type='inventory' {...addProps} />
        {!show && <Button className='ih_btn' text={t('page.import')} onClick={onClickImport} />}
        {!show && <InventoryExcel text={t('page.export')} excelData={data} columns={columns} width={excelWidth} excelName={t('header./inventory')} />}
      </div>
      <div className="filter_wrap">
        <Search1 search={search} setSearch={setSearch} handleEnter={handleEnter} width={width?.search} />
        <PlainSelect {...selectProps} s_value='siteId' s_descr='name'
          value={site}
          setValue={onChangeSite}
          data={sites}
          loading={loading}
          onFocus={onFocusSite}  />
        <PlainSelect {...selectProps} s_value='categoryId' s_descr='categoryName'
          value={category}
          setValue={onChangeCategory}
          data={categories}
          onFocus={onFocusCategory} />
        <PlainSelect {...selectProps} s_value='vendId' s_descr='vendName'
          value={vend}
          setValue={onChangeVendor}
          data={vends}
          onFocus={onFocusVendor} />
      </div>
    </div>
  );
}