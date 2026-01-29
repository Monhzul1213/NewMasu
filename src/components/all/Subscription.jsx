import React, { useEffect, useState } from "react";
import { Modal, Steps } from "antd";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import QRCode from 'react-qr-code';

// import '../../css/modal.css';
import { getList, getServiceBarimt, sendRequest } from "../../services";
import { banks, domain, encrypt, formatNumber, selectSubscription, subContent, subContent1 } from "../../helpers";
import { qr_holder, star } from "../../assets";
import { Overlay } from "./Loader";
import { DynamicAIIcon, DynamicBSIcon, DynamicMDIcon } from "./DynamicIcon";
import { Error1 } from "./Error";
import { Money } from "./Money";
import { Button, IconButton } from "./Button";
import { Input } from "./Input";
import { BankSelect } from "./Select";
import { BankField } from "./Field";
import { SubscriptionReceipt } from "./SubscriptionReceipt";
import { image23, image24 } from "../../assets/sub_icons";

export function Subscription(props){
  const { visible, setVisible, noBack, onDone } = props;
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [amt, setAmt] = useState(0);
  const [type, setType] = useState(0);
  const [txnNo, setTxnNo] = useState('');
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClose = () => {
    setVisible(false);
    if(!noBack) navigate(-1);
  }

  const saveInvoice = async (info) => {
    setLoading(true);
    setError(null);
    const response = await dispatch(sendRequest(user, token, 'Txn/ModInvoice', info));
    setLoading(false);
    return response;
  };

  const typeProps = { selected, setSelected, setAmt, setType, setCurrent };
  const receiptProps = { setError, type, data: selected, amt, saveInvoice, setCurrent, setTxnNo };
  const payProps = { setError, txnNo, amt, onDone, setVisible };

  const steps = [
    { title: 'Subscription', content: <Types {...typeProps} /> },
    { title: 'Receipt', content: <Receipt {...receiptProps} /> },
    { title: 'Payment', content: <Pay {...payProps} /> }
  ];
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={current === 1 || current === 2 ? 500 : 800}>
      <Overlay loading={loading} className={current === 2 ? 'pay_back': 'm_back4'} > 
        <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onClose} />
        <Steps current={current} items={steps} />
        <div>{steps[current]?.content}</div>
        <div className='gap' />
        {error && <Error1 error={error} />}
      </Overlay>
    </Modal>
  );
}

function Types(props){
  const { selected, setSelected, setAmt, setType, setCurrent } = props;
  const { t } = useTranslation();
  const [itemAmt, setItemAmt] = useState([]);
  const [saleAmt, setSaleAmt] = useState([]);
  const [length, setLength] = useState('sar');

  useEffect(() => {
    onSelect(selectSubscription && selectSubscription[0])
    return () => {};
  }, []);

  const onSelect = item => {
    setItemAmt([item?.amt, item?.amt1]);
    setSaleAmt([item?.saleAmt, item?.psaleAmt]);
    setLength(item?.label1);
    setSelected(item);
  }

  const onNext = () => {
    setAmt(selected?.amt);
    setType(selected?.type);
    setCurrent(1);
  };

  const onNext1 = () => {
    setAmt(selected?.amt1);
    setType(selected?.type1);
    setCurrent(1);
  };

  const renderItem = (item, index) => {
    const active = selected?.value === item?.value;
    return (
      <div key={index} onClick={() => onSelect(item)} style={{ position: 'relative' }}>
        <p className={`sub_type_title ${active ? 'active' : ''}`}>{item?.label}</p>
        {item?.discount ?
          <div className="discount-wrapper">
            <img src={star} alt="star" className="star-img" />
            <span className="star-text">{item?.discount}%</span>
          </div>
        : null}
      </div>
    );
  }

  const renderContent = (item, index) => {
    return (
      <div key={index} className='content_back'>
        <DynamicMDIcon name='MdCheck' className='content_icon'/>
        <p className='content_text'>{item?.label}</p>
      </div>
    );
  };

  return (
    <div className='sub_type_scroll' id='list_scroll'>
      <p className='sub_type_header'>{t('invoices.invoices')}</p>
      <div className='sub_type_select_back'> 
        {selectSubscription?.map(renderItem)}
      </div>
      <div className='sub_types'>
        <div className='sub_type_back'>
          <div className='pay_row'>
            <img src={image24} alt='image24'/>
            <p className='sub_type_title_back'>Standard</p>
          </div>
          <div className='pay_row'>
            {saleAmt[0] ? <p className='sub_sale_price'>{<Money value={saleAmt[0]}/>}</p> : <div style={{width: '100px'}}/>}
            <p className='sub_type_price'>{<Money value={itemAmt[0]}/>}{'/' + length}</p>
          </div>
          <div className='sub_content_back' id='list_scroll'>
            {subContent1?.map(renderContent)}
          </div>
          <Button className='sub_step_next' text={t('invoices.pay')} onClick={onNext}/>
        </div>
        <div className='sub_type_back' >
          <div className='pay_row'>
            <img src={image23} alt='image23'/>
            <p className='sub_type_title_back'>Premium</p>
          </div>
          <div className='pay_row'>
            {saleAmt[1] ? <p className='sub_sale_price'>{<Money value={saleAmt[1]}/>}</p> : <div style={{width: '100px'}}/>}
            <p className='sub_type_price'>{<Money value={itemAmt[1]}/>}{'/' + length}</p>
          </div>
          <div className='sub_content_back' id='list_scroll'>
            {subContent?.map(renderContent)}
          </div>
          <Button className='sub_step_next' text={t('invoices.pay')}  onClick={onNext1}/>
        </div>
      </div>
    </div>
  );
}

function Receipt(props){
  const { setError, type, data, amt, saveInvoice, setCurrent, setTxnNo } = props;
  const { t } = useTranslation();
  const [selected, setSelected] = useState(0);
  const [regNo, setRegNo] = useState({ value: '' });
  const [name, setName] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const onClick1 = () => setSelected(1);
  const onClick = () => {
    setSelected(0);
    setName({ value: '' });
    setRegNo({ value: '' });
  }

  const onChangeRegNo = value => {
    setRegNo(value);
    setName({ value: '' });
    setError(null);
  }

  const handleEnter = async e => {
    e?.preventDefault();
    if(regNo?.value){
      setLoading(true);
      setError(null);
      const response = await dispatch(getServiceBarimt('?regno=' + regNo?.value));
      if(response?.error) setError(response?.error);
      else if(response?.data?.found){
        setName({ value: response?.data?.name });
      } else {
        setError(t('invoices.error'));
        setName({ value: '' });
      }
      setLoading(false);
    } else
      setRegNo({ value: '', error: t('error.not_empty') });
  }

  const onNext = async () => {
    if(selected === 1){
      if(!regNo?.value){
        setError(t('invoices.rd_empty'));
        return;
      }
      if(!name?.value){
        setError(t('invoices.name_empty'));
        return;
      }
    };
    let invoiceData = {
      invoiceNo: '',
      invoiceType: type,
      invoiceTime: data?.length,
      amount: amt,
      vatType: selected,
      vatCustomerId: regNo?.value,
      rowStatus: 'I',
    };
    const response = await saveInvoice(invoiceData);
    if(response?.error) setError(response?.error);
    else {
      setTxnNo(response?.data?.invoiceNo);
      setCurrent(2);
    }
  }
  
  return (
    <div className='pay_scroll'>
      <p className='es_title1'>{t('invoices.receipt_send')}</p>
      <div className='receipt_switch_container'>
        <div className={`receipt_option ${selected === 0 ? 'active' : ''}`} onClick={onClick}>
          {t('invoices.individual')}
        </div>
        <div className={`receipt_option ${selected === 1 ? 'active' : ''}`}  onClick={onClick1}>
          {t('invoices.customerID')}
        </div>
      </div>
      {selected === 1 && <div style={{display: 'flex', marginTop: 15, flexFlow: 'row', alignItems: 'center'}}>
        <div style={{display: 'flex', margin: 0, flexFlow: 'column', flex: 1}}>
          <Input
            value={regNo}
            setValue={onChangeRegNo}
            placeholder={t('invoices.RD')}
            classBack='re_select_back'
            handleEnter={handleEnter} />
          <Input
            value={name}
            setValue={setName}
            placeholder={t('invoices.company_name')}
            classBack='re_select_back'
            disabled={true} />
        </div>
        <div className='gap'/>
        <IconButton
          loading={loading}
          onClick={handleEnter}
          className='re_check_btn' 
          icon={<DynamicBSIcon name='BsCheckLg' className='re_back_icon' />} />
      </div>}
      <div style={{display: 'flex', justifyContent: 'center', marginTop: 20}}>
        <Button className='re_step_next' text={t('page.next')} onClick={onNext}/>
      </div>
    </div>
  );
}

function Pay(props){
  const { setError, txnNo, amt, onDone, setVisible } = props;
  const { t } = useTranslation();
  const [tab, setTab] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [qr, setQR] = useState('');
  const [value, setValue] = useState(0);
  const [selected, setSelected] = useState(banks[0]);
  const [visible1, setVisible1] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getQR();
    return () => {};
  }, []);

  const getQR = async () => {
    setError(null);
    setLoading(true);
    setQR(null);
    let data = { invoiceNo: txnNo, amount: amt };
    let response = await dispatch(sendRequest(user, token, 'System/GetQPayQr', data));
    if(response?.error) setError(response?.error);
    else setQR(response?.data?.qr_text)
    setLoading(false);
  }

  useEffect(() => {
    const intervalCall = setInterval(() => checkInvoice(), 10000);
    return () => clearInterval(intervalCall);
  }, []);

  const checkInvoice = async () => {
    let api = 'Txn/GetInvoice?InvoiceNo=' + txnNo;
    let response = await dispatch(getList(user, token, api));
    if(response?.error) setError(response?.error);
    if(!response?.error){
      let invoice = response?.data && response?.data?.invoice && response?.data?.invoice[0]?.status;
      if(invoice === 3) setVisible1(true)
    }
  };

  const onPressExport = () => {
    let code = encrypt(txnNo);
    let url = domain + '/statement?invoiceno=' + encodeURIComponent(code);
    window.open(url);
  }

  const changeValue = index => {
    setValue(index);
    setSelected(banks[index]);
  }

  const onBack1 = () => {
    setVisible(false)
    setVisible1(false);
  }

  const Tab = ({ label, index }) => {
    const id = index === tab ? 'tab_btn_active' : 'tab_btn_inactive';
    return (<div className='pay_card_btn' id={id} onClick={() => setTab(index)}>{t('invoices.' + label)}</div>);
  }
  
  return (
    <div className='pay_scroll'>
      {visible1 && <SubscriptionReceipt visible={visible1} setVisible={setVisible1} onBack={onBack1} print={true} invNo={txnNo} />}
      <p className='es_title1'>{t('invoices.pay')}</p>
      <div className='pay_tab_back'>
        <Tab label='qpay' index={-1} />
        <Tab label='acct' index={1} />
      </div>
      {tab === -1 ? 
        <div className='pay_back_col'>
          <Overlay loading={loading}>
            {!qr
              ? <img className='es_qr_holder' src={qr_holder} alt='Logo' />
              : <QRCode
                  className='pay_qr_back'
                  size={220}
                  style={{ margin: '5px 0'}}
                  value={qr} />
            }
          </Overlay>
          <p className='pay_amt_title'>{t('invoices.amt')}</p>
          <p className='pay_amt'>{formatNumber(amt)}₮</p>
          <div className='pay_button_back'>
            <Button className='pay_step_invoice' text={t('invoices.invoice')} onClick={onPressExport} />
          </div>
        </div>
        : 
        <div className='pay_back_col2'>
          <p className='pay_amt_title'>{t('invoices.amt')}</p>
          <p className='pay_amt'>{formatNumber(amt)}₮</p>
          <BankSelect
            label={t('invoices.bank')}
            value={value}
            setValue={changeValue}
            data={banks} />
          <BankField label={t('invoices.acct_no')} value={selected?.acct} />
          <BankField label={t('invoices.receive')} value={selected?.name} />
          <BankField label={t('invoices.txn_descr')} value={txnNo} isBold={true} />
          <div className='line2' />
          <p className='card_warning1'>{t('invoices.warning')}</p>
          <div className='pay_button_back1'>
            <Button className='pay_step_invoice' text={t('invoices.invoice')} onClick={onPressExport} />
            <Button className='pay_step_invoice' text={t('invoices.paid')} onClick={onDone} />
          </div>
        </div>
      }
    </div>
  );
}