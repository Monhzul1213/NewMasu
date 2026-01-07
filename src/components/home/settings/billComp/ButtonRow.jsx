import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../all';

export function ButtonRow(props){
  const { t } = useTranslation();
  const { onClickCancel, onClickSave, type, text1, text2 } = props;

  return (
    <div className='co_btn_row'>
      <Button className='co_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='co_btn' id='co_btn_save' text={t(text2 ?? 'login.save')} type={type} onClick={onClickSave} />
    </div>
  )
}