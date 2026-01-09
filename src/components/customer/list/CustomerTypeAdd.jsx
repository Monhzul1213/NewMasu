import React, { useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { sendRequest } from "../../../services";
import { ButtonRow, Error, Input, Overlay, ModalTitle, Select } from "../../all";

export function CustomerTypeAdd(props){
  const { visible, closeModal } = props;
  const { t } = useTranslation();
  const [typeName, setTypeName] = useState({ value: '' });
  const [status, setStatus] = useState({ value: 1 });
  const [states] = useState([{ value: 1, label: t('page.active') }, { value: 0, label: t('page.inactive') }]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  const validateData = () => {
    if(typeName?.value?.trim()) return true;
    else {
      if(!typeName?.value?.trim()) setTypeName({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(validateData()){
      setLoading(true);
      let data = { customerTypeId: 0, typeName: typeName?.value, status: status?.value, rowStatus: 'I' };
      const response = await dispatch(sendRequest(user, token, 'Site/ModCustomerType', data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        closeModal(true, response?.data?.customerTypeId);
        toast.success(t('customer.add_type_success'));
      }
    } 
  }
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={420}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle title={t('customer.type')} />
            <Input 
              value={typeName}
              setValue={setTypeName}
              label={t('customer.t_type')}
              placeholder={t('customer.t_type')}
              setError={setError} />
            <Select
              label={t('customer.status')}
              value={status}
              setValue={setStatus}
              data={states} />
          {error && <Error error={error} id ='m_error' />}
        </div>
        <ButtonRow type='submit' onClickCancel={() => closeModal()} onClickSave={onClickSave} />
      </Overlay>
    </Modal>
  );
}