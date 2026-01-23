import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Confirm } from "./Confirm";
import { DynamicBSIcon } from "./DynamicIcon";
import { Loader } from "./Loader";

export function Button(props){
  const { loading, type, className, id, text, disabled, onClick } = props;

  return (
    <button type={type} className={className ?? 'ih_btn'} id={id} disabled={loading || disabled} onClick={onClick}>
      {loading ? <Loader className='l_loader' color='#fff' /> : text}
    </button>
  );
}

export function ButtonRow(props){
  const { onClickCancel, onClickSave, onClickDelete, type, show, text1, text2 } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const onDelete = () => setOpen(true);

  const confirm = async sure => {
    setOpen(false);
    if(sure) onClickDelete();
  }

  const confirmProps = { open, text: t('page.delete_confirm'), confirm };

  return (
    <div className='a_btn_row'>
      {open && <Confirm {...confirmProps} />}
      {show && <DynamicBSIcon className='a_btn_delete' name='BsTrash' onClick={onDelete} />}
      <Button className='a_btn' text={t(text1 ?? 'page.cancel')} onClick={onClickCancel} />
      <Button className='a_btn' id='a_btn_save' text={t(text2 ?? 'login.save')} type={type} onClick={onClickSave} />
    </div>
  );
}

export function IconButton(props){
  const { loading, type, className, id, text, icon, disabled, onClick } = props;

  return (
    <button type={type} className={className} id={id} disabled={loading || disabled} onClick={onClick}>
      {loading ? <Loader className='l_loader' color='#fff' /> : icon}
      {text}
    </button>
  );
}