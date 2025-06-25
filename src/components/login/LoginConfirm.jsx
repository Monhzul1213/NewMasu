import React, { useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useTimer } from 'react-timer-hook';
import { useDispatch } from "react-redux";
import ReactInputMask from "@mona-health/react-input-mask";

import { getService } from "../../services";
import { Button, DynamicAIIcon, Error } from "../all";

export function LoginConfirm(props){
  const { visible, number, email, closeModal, expire, fromPartner } = props;
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { seconds, minutes, isRunning, restart } = useTimer({ expiryTimestamp: expire, onExpire: () => {} });

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") onClickConfirm();
  }

  const onChange = e => {
    setCode(e.target.value);
    setError && setError(null);
  }

  const onClickSend = async () => {
    setLoading(true);
    let api = 'Merchant/SentSMS?mobile=' + number + '&email=' + email + (fromPartner ? '&RegisterType=Partner' : '');
    let response = await dispatch(getService(api));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      const time = new Date();
      time.setSeconds(time.getSeconds() + 300);
      restart(time);
    }
  }

  const onClickConfirm = async () => {
    setLoading(true);
    let api = 'Merchant/Validate/Phone?mobile=' + number + '&regnum=' + code?.replace(/[ _]/g, '');
    let response = await dispatch(getService(api));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      toast.success(t('login.success'));
      closeModal(true);
    }
  }
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <div className='m_back'>
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={() => closeModal()} />
        <p className='ap_title'>{t('login.confirm')}</p>
        <div className='cfnumber_back'>
          <p className='cfnumber_text'>{number}</p>
        </div>
        <p className='cf_msg'>{t('login.confirm_msg')}</p>
        <p className='cfcode_lbl'>{t('login.confirm_code')}</p>
        <div className='cfcode_input_back'>
          <ReactInputMask
            className='cfcode_input'
            mask='9 9 9 9 9 9'
            maskPlaceholder='_'
            onKeyDown={onKeyDown}
            value={code}
            disabled={!isRunning}
            placeholder='_ _ _ _ _ _'
            onChange={onChange} />
          {isRunning
            ? <p className='cf_sec'>{minutes * 60 + seconds} {t('login.seconds')}</p>
            : <Button className='cf_btn' text={t('login.resend')} loading={loading} onClick={onClickSend}  />}
        </div>
        <div className='gap' />
        {error && <Error error={error} />}
        <Button className='l_btn' loading={loading} text={t('login.confirm')} onClick={onClickConfirm} />
      </div>
    </Modal>
  );
}