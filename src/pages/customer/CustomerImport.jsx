import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { sendRequest } from "../../services";
import { excelTypes } from "../../helpers";
import { ButtonRowConfirm, Error1, Overlay, UploadDrag } from "../../components/all";

export function CustomerImport(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.msRole?.webManageCustomer !== 'Y') navigate({ pathname: '/' });
    return () => {};
  }, []);

  const onClickCancel = () => navigate('/customer/customer');

  const onClickSave = async () => {
    setError(null);
    if(file){
      setLoading(true);
      let formData = new FormData();
      formData.append('file', file?.object);
      let response = await dispatch(sendRequest(user, token, 'Site/Customer/AddExcel', formData, 'multipart/form-data'));
      if(response?.error) setError(response?.error);
      else {
        toast.success(t('customer.add_success'));
        setFile(null);
      }
      setLoading(false);
    } else
      setError(t('error.import_error'));
  }

  return (
    <div className='page_container' style={{ maxWidth }}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        <div className='ma_back'>
          <div className='ii_header'>
            <p className='ii_title'>{t('customer.import_title')}</p>
            <a className='ii_link' href='/assets/formats/Customer_Format.xlsx' download='Customer_Format.xlsx'>{t('customer.import_link')}</a>
          </div>
          <UploadDrag file={file} setFile={setFile} types={excelTypes} />
        </div>
        <ButtonRowConfirm id='mo_ac_btns' onClickCancel={onClickCancel} onClickSave={onClickSave} />
      </Overlay>
    </div>
  );
}