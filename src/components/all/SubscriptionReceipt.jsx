import React, { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import QRCode from "react-qr-code";
import moment from 'moment';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// import '../../css/modal.css';
import { getList } from "../../services";
import { logo_image, qr_holder } from "../../assets";
import { Overlay } from "./Loader";
import { TableFooter } from "./Table";
import { Money } from "./Money";
import { Error1 } from "./Error";
import { Button } from "./Button";

export function SubscriptionReceipt(props){
  const { visible, onBack, onDone1, print, invNo } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);
  const [data, setData] = useState([]);
  const [amt, setAmt] = useState(null);
  const [qr, setQR] = useState('');
  const [error, setError] = useState(null);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible) getQR();
    return () => {};
  }, [visible]);

  const getQR = async () => {
    setError(null);
    setLoading(true);
    setQR(null);
    let api = 'System/GetMasuVat' + '?InvoiceNo=' + invNo;
    let response = await dispatch(getList(user, token, api ));
    if(response?.error) setError(response?.error);
    else {
      toast.success(t('invoices.success_pay'));
      setQR(response?.data?.ebarimtdata?.qrData);
      setInfo(response?.data);
      setData(response?.data?.info);
    }
    setLoading(false);
  }

  const onPressPrint = () => {
    html2canvas(document.getElementById('tax_pdf')).then(function(canvas) {
      const imgWidth = 188, pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight, position = 10, margin= 10;
      heightLeft -= pageHeight;
      const pdf = new jsPDF('p', 'mm');
      pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(canvas, 'PNG', margin, position, imgWidth, imgHeight, '', 'FAST');
        heightLeft -= pageHeight;
      }
      pdf.save(t('system.receipt') + '.pdf');
    });
  }
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={650}>
      <Overlay loading={loading} className='m_back2'>
        <div id='tax_pdf'>
          <img className='sys_logo' src={logo_image} alt='Logo' />
          <div className='h_row'>
            <p className='h_text'>{t('invoices.receipt')}</p>
          </div>
          <div className='line1'/>
          <div className='row_between'>
            <div className='row_center'>
              <p className='h_label'>{t('bill.ddtd')}: </p>
              <p className='sys_info_value'>{info?.ebarimtdata?.billId}</p>
            </div>
            <div className='row_center'>
              <p className='h_label'>{t('page.date')}: </p>
              <p className='sys_info_value'>{moment(info?.merchant?.lastUpdate).format('yyyy.MM.DD HH:mm')}</p>
            </div>
          </div>
          <div className='sys_row'>
            <div className='flex'>
              <p className='sys_label'>{t('invoices.receive1')}:</p>
              <Field1 label={t('page.name')} value={t('company.name1')}/>
              <Field1 label={t('bill.address')} value={t('company.address1')}/>
              <Field1 label={t('bill.phone')} value={t('company.phone')}/>
              <Field1 label={t('invoices.bank')} value={t('company.bank')}/>
              <Field1 label={t('invoices.bank_no')} value={t('company.acct')}/>
            </div>
            <div className='flex'>
              <p className='sys_label'>{t('invoices.resend')}:</p>
              <Field label={t('page.name')} value={info?.merchant?.descr}/>
              <Field label={t('customer.mail')} value={info?.merchant?.email}/>
              <Field label={t('bill.phone')} value={info?.merchant?.address}/>
            </div>
          </div>
          <div>{data?.length ? <TaxList data={data} setAmt={setAmt} /> : null}</div>
          <div className='line1' />
          <div className='tax_back'>
            <div className='es_pay_col'>
              {qr
                ? <QRCode size={180} style={{ margin: '5px 0' }} value={qr} />
                : <img className='es_qr_holder' src={qr_holder} alt='Logo' />
              }
            </div>
            <div className='sys_pdf_col'>
              <Field2 label={t('invoices.tax_no')} value={info?.ebarimtdata?.lottery} />
              <Field2 label={t('invoices.e_amt')} value={<Money value={amt} />} />
            </div>
          </div>
        </div>
        <div className='gap' />
        {error && <Error1 error={error} />}
        <Step onBack={onBack} print={print} onPressPrint={onPressPrint} />
      </Overlay>
    </Modal>
  );
}

const Field1 = ({ label, value }) => {
  return (
    <div className='sys_info_row'>
      <p className='sys_info_label1'>{label} : </p>
      <p className='sys_info_value'>{value}</p>
    </div>
  );
}

const Field = ({ label, value }) => {
  return (
    <div className='sys_info_row'>
      <p className='sys_info_label'>{label} : </p>
      <p className='sys_info_value'>{value}</p>
    </div>
  );
}

const Field2 = ({ label, value }) => {
  return (
    <div className='sys_info_row'>
      <p className='sys_pdf_value'>{label} : </p>
      <p className='sys_pdf_value'>{value}</p>
    </div>
  );
}

function TaxList(props){
  const { data, setAmt } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('name', {
        header: <div style={{textAlign: 'center'}}>{t('page.name')}</div>,
        enableSorting: false,
      }),
      columnHelper.accessor('subscriptionName', {
        header: <div style={{textAlign: 'center'}}>{t('invoices.service_name')}</div>,
        cell: cell => <div style={{paddingLeft: 5}}>{cell.getValue()}</div>,
        enableSorting: false,
      }),
      columnHelper.accessor('subscriptionTimeName', {
        header: <div style={{textAlign: 'center'}}>{t('invoices.time')}</div>,
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          return <div style={{textAlign: 'right'}}>{t('customer.total') + rows?.length}</div>
        },
        enableSorting: false,
      }),
      columnHelper.accessor('amount', {
        header: <div style={{textAlign: 'center', paddingRight: 15}}>{t('invoices.amount')}</div>,
        cell: cell => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={cell.getValue()} /></div>,
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = useMemo(() => rows?.reduce((sum, row) => row.getValue('amount') + sum, 0), [rows]);
          setAmt(total);
          return <div style={{textAlign: 'right', paddingRight: 15}}><Money value={total} /></div>
        },
        enableSorting: false,
      }),
    ]);
    return () => {};
  }, [i18n?.language]);

  const tableInstance = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });
  const tableProps = { tableInstance, hasFooter: true };

  return (
    <div className='table_scroll'>
      <div id='paging' style={{marginTop: 10, overflowY: 'scroll', maxHeight: 500, minWidth: 520}}>
        <TableFooter {...tableProps} />
      </div>
    </div>
  );
}

export function Step(props){
  const { print, onPressSent, onBack, onPressPrint } = props;
  const { t } = useTranslation();

  return (
    <div className='row_between'>
      <Button className='step_prev' text={t('page.cancel')} onClick={onBack} />
      {print
        ? <Button className='step_next' text={t('invoices.tax_print')} onClick={onPressPrint} /> 
        : <Button className='step_next' text={t('invoices.tax_sent')} onClick={onPressSent} />
      }
    </div>
  );
}