import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { sendRequest } from "../../services";
import { excelTypes } from "../../helpers";
import { ButtonRowConfirm, Error1, Overlay, UploadDrag } from "../../components/all";

export function InventoryImport(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageItem !== 'Y') navigate({ pathname: '/' });
    return () => {};
  }, []);

  const onClickCancel = () => navigate('/inventory/invt_list');

  const onClickSave = async () => {
    setError(null);
    if(file){
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file?.object);
      let response = await dispatch(sendRequest(user, token, 'Inventory/AddInventoryExcel', formData, 'multipart/form-data'));
      if(response?.error) setError(response?.error);
      else {
        toast.success(t('inventory.add_success'));
        setFile(null);
      }
      setLoading(false);
    } else
      setError(t('inventory.import_error'));
  }

  return (
    <div className='page_container' style={{ maxWidth }}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='ma_back'>
          <div className='ii_header'>
            <p className='ii_title'>{t('inventory.import_title')}</p>
            <a className='ii_link' href='/assets/formats/Baraa_Format.xlsx' download='Baraa_Format.xlsx'>{t('inventory.import_link')}</a>
          </div>
          <UploadDrag file={file} setFile={setFile} types={excelTypes} />
        </div>
        <ButtonRowConfirm id='mo_ac_btns' onClickCancel={onClickCancel} onClickSave={onClickSave} />
      </Overlay>
    </div>
  );
}