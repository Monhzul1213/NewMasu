import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { getServiceOTC } from "../../services";
import { Button } from "./Button";
import { Input } from "./Input";

export function Validate(props){
  const { label, value, setValue, disabled, api } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleCheck = async () => {
    if(value?.value){
      setLoading(true);
      const response = await dispatch(getServiceOTC(api + value?.value));
      if(response?.error) setValue({...value, error: response?.error });
      else setValue({...value, name: response?.data?.retdata, error1: null });
      setLoading(false);
    }
  }

  return !disabled && (
    <div>
      <div className='sp_check_row'>
        <Input
          value={value}
          setValue={setValue}
          handleEnter={handleCheck}
          inRow={true}
          disabled={disabled}
          noBlur={true}
          label={t('supplier.' + label + '_code')}
          placeholder={t('supplier.' + label + '_code')} />
        <div className='im_gap' />
        <Button
          id='sp_check_btn'
          className='co_check_btn'
          text={t('login.check')}
          onClick={handleCheck}
          disabled={disabled}
          loading={loading} />
      </div>
      <Input
        value={{ value: value?.name ?? '', error: value?.error1 }}
        disabled={true}
        label={t('supplier.' + label + '_name')}
        placeholder={t('supplier.' + label + '_name')} />
    </div>
  );
}