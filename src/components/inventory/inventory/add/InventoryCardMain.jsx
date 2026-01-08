import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useMeasure from "react-use-measure";

import { limitList } from "../../../../helpers";
import { getList } from "../../../../services";
import { CheckBox, DescrInput, DynamicBSIcon, IconButton, Input, MoneyInput, Radio, Select, TimeInput, UploadImage } from "../../../all";
import { VendorAdd } from "../../../customer/vendor";
import { CategoryAdd } from "../../category";

export function InventoryCardMain(props){
  const { setError, setEdited, name, setName, category, setCategory, isEach, setIsEach, isUseTime, setIsUseTime, batch, setBatch, isService, setIsService,
    time, setTime, image, setImage, setImage64, setImageType, descr, setDescr, price, setPrice, cost, setCost, setSites, sku, setSku, barcode, setBarcode,
    buyAgeLimit, setBuyAgeLimit, vendId, setVendId, setIsKit, setLoading } = props;
  const { t } = useTranslation();
  const [categories, setCategories] = useState([{ categoryId: -1, categoryName: t('inventory.no_category') }]);
  const [categoryVisible, setCategoryVisible] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [vendorVisible, setVendorVisible] = useState(false);
  const [ref, bounds] = useMeasure();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getData();
    return () => {};
  }, []);

  const getData = async () => {
    setLoading(true);
    let response = await getVendors();
    if(response) await getCategories();
    setLoading(false);
  }

  const getCategories = async (toGet, id) => {
    if(!categories?.length || categories?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
      if(response?.error) setError(response?.error);
      else {
        let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
        setCategories(data);
        if(id) setCategory({ value: id });
      }
    }
  }

  const getVendors = async id => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      setVendors(response?.data);
      if(id) setVendId({ value: id });
      return true;
    }
  }

  const onClickCategory = e => {
    e?.preventDefault();
    setCategoryVisible(true);
  }

  const closeCategory = (saved, id) => {
    setCategoryVisible(false);
    getCategories(saved, id);
  }

  const changeBatch = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setBatch({...value, error: 'must_number'});
    else setBatch({ value: text });
  }

  const onChangeUseTime = value => {
    setIsUseTime(value);
    setIsService(false);
    setIsKit(false);
  }

  const onPriceChange = () => {
    setSites(old => old.map((row, index) => {
      if(!row.changed) return { ...old[index], price: price?.value };
      return row
    }));
  }

  const changeBarcode = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setBarcode({...value, error: 'must_number'});
    else setBarcode({ value: text });
  }

  const onClickVendor = e => {
    e?.preventDefault();
    setVendorVisible(true);
  }

  const closeVendor = (saved, id) => {
    setVendorVisible(false);
    if(saved) getVendors(id);
  }

  const id = bounds?.width > 480 ? 'im_large' : 'im_small';
  const idRow = bounds?.width > 445 ? 'im_input_row_large' : 'im_input_row_small';
  const idRow2 = bounds?.width > 540 ? 'tm_unit_row_large' : 'tm_unit_row_small';
  const inputProps = { setError, setEdited, inRow: true };
  const imageProps = { image, setImage, setImage64, setImageType, setEdited, setError, className: 'im_image' };

  return (
    <div className='ia_back' id={id} ref={ref}>
      {categoryVisible && <CategoryAdd visible={categoryVisible} closeModal={closeCategory} />}
      {vendorVisible && <VendorAdd visible={vendorVisible} closeModal={closeVendor} />}
      <div className='ia_image_row'>
        <div style={{flex: 1}}>
          <Input {...inputProps}
            label={t('page.name')}
            placeholder={t('inventory.name')}
            value={name}
            setValue={setName}
            length={75} />
          <div id='im_unit_row_large'>
            <div style={{flex: 1}}>
              <Select {...inputProps} inRow={false}
                label={t('inventory.category')}
                value={category}
                setValue={setCategory}
                data={categories}
                onFocus={getCategories}
                s_value='categoryId' s_descr='categoryName' />
            </div>
            <IconButton className='im_add_btn' onClick={onClickCategory} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
          </div>
          <div id={idRow}>
            <Radio {...inputProps} inRow={false}
              label={t('inventory.unit')}
              value={isEach}
              setValue={setIsEach}
              data={t('inventory.units')}
              className='radio_back_dis'
              disabled={isUseTime ? true : false} />
            <div style={{flex: 1, marginLeft: 5}}>
              <Input {...inputProps} inRow={false}
                value={batch}
                setValue={changeBatch}
                label={t('inventory.t_batch')}
                placeholder={t('inventory.t_batch')} />
            </div>
          </div>
          <div id={idRow2}>
            <CheckBox
              label={t('inventory.service')}
              style={{width: isService ? '40%' : '100%', marginRight: 10}}
              checked={isService}
              setChecked={setIsService}
              disabled={isUseTime ? true : false} />
            <div className='gap' />
            {isService && <TimeInput
              label={t('inventory.service_time')}
              style={{width: '60%'}}
              value={time}
              setValue={setTime} />}
          </div>
          <CheckBox
            label={t('inventory.use_time')}
            checked={isUseTime}
            setChecked={onChangeUseTime} />
        </div>
        <div className='gap' />
        <UploadImage {...imageProps} />
      </div>
      <DescrInput {...inputProps} inRow={false}
        id='m_input_descr1'
        label={t('inventory.descr1')}
        placeholder={t('inventory.descr1')}
        value={descr}
        setValue={setDescr}
        length={500} />
      <div id={idRow}>
        <MoneyInput {...inputProps}
          label={t('inventory.price')}
          placeholder={t('inventory.price')}
          value={price}
          setValue={setPrice}
          onBlur={onPriceChange} />
        <div className='im_gap' />
        <MoneyInput {...inputProps}
          label={t('inventory.cost')}
          placeholder={t('inventory.cost')}
          value={cost}
          setValue={setCost} />
      </div>
      <div id={idRow}>
        <Input {...inputProps}
          label={t('inventory.sku')}
          placeholder={t('inventory.sku')}
          value={sku}
          setValue={setSku}
          length={30} />
        <div className='im_gap' />
        <Input {...inputProps}
          label={t('inventory.barcode')}
          placeholder={t('inventory.barcode')}
          value={barcode}
          setValue={changeBarcode}
          length={30} />
      </div>
      <div id={idRow}>
        <Select {...inputProps}
          label={t('inventory.limit')}
          value={buyAgeLimit}
          setValue={setBuyAgeLimit}
          data={limitList} />
        <div className='im_gap' />
        <div className='im_vend_row'>
          <Select {...inputProps}
            label={t('inventory.vendor')}
            placeholder={t('inventory.vendor')}
            value={vendId}
            setValue={setVendId}
            data={vendors}
            s_value='vendId' s_descr='vendName' />
          <IconButton className='im_add_btn' onClick={onClickVendor} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
        </div>
      </div>
    </div>
  );
}