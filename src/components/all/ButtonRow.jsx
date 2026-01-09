import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, IconButton } from "./Button";
import { Confirm, Warning } from "./Confirm";
import { DynamicBSIcon } from "./DynamicIcon";

export function ButtonRowAdd(props){
  const { type, onClickAdd, show, onClickDelete } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='add_row_back'>
      {open && <Confirm {...confirmProps} />}
      <IconButton
        className='add_row_btn' id='add_row_add'
        text={t(type + '.add')}
        icon={<DynamicBSIcon name='BsPlusLg' className='add_row_icon' />}
        onClick={() => onClickAdd()} />
      {show && <IconButton
        className='add_row_btn' id='add_row_delete'
        text={t('page.delete')}
        icon={<DynamicBSIcon name='BsTrash' className='add_row_delete_icon' />}
        onClick={onDelete} />}
    </div>
  );
}

export function ButtonRowConfirm(props){
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2, id, disabled, error, isModal, noSave } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);

  const onDelete = () => {
    disabled ? setOpen1(true) : setOpen(true);
  }

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const close = () => setOpen1(false);

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };
  const warningProps = { open: open1, text: error, close };

  return (
    <div className={isModal ? 'a_btn_row' : 'invt_btn_row'} id={id}>
      {open && <Confirm {...confirmProps} />}
      {open1 && <Warning {...warningProps} />}
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onDelete} />}
      <div style={{flex: 1}} />
      <Button className={isModal ? 'a_btn' : 'invt_btn'} text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      {!noSave && <Button className={isModal ? 'a_btn' : 'invt_btn'} id={isModal ? 'a_btn_save' : 'invt_btn_save'}
        text={t(text2 ?? 'login.save')} type={type} onClick={onClickSave} />}
    </div>
  );
}