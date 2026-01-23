import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import moment from 'moment';

import { getList } from "../../../services";
import { domain, encrypt } from "../../../helpers";
import { Empty1, Error, ExportExcel, Overlay, Money, PlainRange, TableRowResize, Button, DynamicAIIcon } from "../../all";
import ReceivableCalc from "./ReceivableCalc";

export function CustomerTransaction(props){
  const { visible, setVisible, selected, selectedDate, txnType, onSearch } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [date, setDate] = useState(selectedDate ?? [moment().subtract(3, 'month'), moment()]);
  const [columns, setColumns] = useState([]);
  const [visibleReceivable, setVisibleReceivable] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let query = '?BeginDate=' + (selectedDate ? selectedDate[0]?.format('yyyy.MM.DD') : moment().subtract(3, 'month')?.format('yyyy.MM.DD')) + 
                  '&EndDate=' + (selectedDate ? selectedDate[1]?.format('yyyy.MM.DD') : moment()?.format('yyyy.MM.DD')) + '&custId=' + (selected?.custId ? selected?.custId : selected?.custID);
      
    getData(query);
    return () => {};
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetCustomerTxn' + (query ?? '')));
    if(response?.error) setError(response?.error);
    else {
     response?.data?.txnLists?.forEach( i => {
        i.txnAmount = i.txnType === 'D' ? (-i.txnAmount) : i.txnAmount
      })
      const allList = response?.data?.txnLists ?? [];
      const filtered = txnType
        ? allList.filter(i => i.txnType === txnType)
        : allList;
      setData( txnType ? filtered : response?.data?.txnLists)
      setData1(response?.data?.totalAmounts);
      if(response?.data?.totalAmounts?.length === 1){
        let type = { txnType : 'C', amount: 0 };
        response?.data?.totalAmounts.push(type);
      }
    }
    setLoading(false);
  }

  const onHide = date1 => {
    let query= '?BeginDate=' + date1[0]?.format('yyyy.MM.DD') + '&EndDate=' + date1[1]?.format('yyyy.MM.DD') + '&custId=' + selected?.custId;
    getData(query);
  }

  const onCancel = () => {
    setVisible(false);
    onSearch && onSearch();
  }
  const renderItem = (item, index) => {
    return ( 
      <>
      {item?.txnType !== '0' && <div className='main_row' key={index}>
        <p className='sub_row_value' style={{width: 140}}>{item?.txnType === 'D' ? t('customer.create') : t('customer.close')}</p>
        <Money value={item?.amount} className='sub_row_value' style={{color: item?.txnType === 'D' ? 'var(--danger-color)' : 'var(--config-color)'}}/>
      </div>}
      </> 
    );
  }

  const onClickReceivable = () => {
    setVisibleReceivable(true);
  };

  const closeModal = e => {
    e?.preventDefault();
    setVisibleReceivable(false);
  }
  const listProps = { columns, setColumns, data };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={700}>
      <Overlay loading={loading}>
        {visibleReceivable && 
        <ReceivableCalc 
            visible={visibleReceivable} 
            closeModal={closeModal} 
            onSearch={getData}
            date={date} selected={selected} disabled={true}/>}
        <div className='m_back2'>
          <DynamicAIIcon className='dr_close' name='AiFillCloseCircle' onClick={onCancel} />  
          <p className='es_title'>{t('customer.cus_trans')}</p>
          <div className='main_row' style={{marginTop: 20}}>
            <div className='sub_row1' style={{flex:1}}>
                <div className='main_row'>
                  <p className='sub_row_value' style={{width: 130}}>{t('Харилцагчийн нэр :')}</p> 
                  <p className='sub_row_value'>{selected?.custName}</p>
                </div>
                <div className='main_row'>
                  <p className='sub_row_value' style={{width: 130}}>{t('Төрөл :')}</p> 
                  <p className='sub_row_value'>{selected?.typeName}</p>
                </div>
                <div className='main_row'>
                  <p className='sub_row_value' style={{width: 130}}>{t('Утас :')}</p> 
                  <p className='sub_row_value'>{selected?.phone}</p>
                </div>
            </div>
            <div style={{flex:0.7}}>
                <div className='sub_row1'>
                    {data1?.map(renderItem)}
                </div>           
                <div className='main_row'>
                  <p className='sub_row_value' style={{width: 140}}>{t('customer.balance')}</p> 
                  <Money className='sub_row_value' value={selected?.arBalance ?? selected?.endArAmount ?? 0} />
                </div>
            </div>
          </div>
          <div className="row_between">
            <PlainRange
              className='rh_date'
              // label={t('page.date')}
              value={date}
              setValue={setDate}
              onHide={onHide} />
              <div className="main_row">
                <Button 
                  text={t('customer.receivable_calc')} 
                  onClick={onClickReceivable}/> 
                <ExportExcel
                  text={t('page.export')}
                  columns={columns}
                  excelData={data}
                  excelName={t('customer.cus_trans')} />
              </div>
          </div>
          <CustomerTransactionList {...listProps} />
          {error && <Error error={error} id='m_error' />}
        </div>
      </Overlay>
    </Modal>
  );
}

function CustomerTransactionList(props){
  const { columns, setColumns, data } = props;
  const { i18n, t } = useTranslation();
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('salesDate', {
        header: t('page.date'), exLabel: t('page.date'),
        cell: cell => <div>{moment(cell?.getValue())?.format('yyyy.MM.DD')}</div>,
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          return <div style={{textAlign: 'left', minWidth: 72}}>{t('customer.total') + rows?.length}</div>
        }, size: 90, minSize: 40,  maxSize: 400,
        meta: { style: { width: 72 }},
      }),
      columnHelper.accessor('salesNo', {
        header: t('report.total_sales'), exLabel: t('customer.salesNo'),
        cell: cell => (
          <div className='table_link' onClick={() => onClickLink(cell)}>{cell.getValue()}</div>
        ), size: 120, minSize: 40,  maxSize: 400,
        meta: { onClickLink, noClick: true, style: { maxWidth: 130 } },
      }),
      columnHelper.accessor('siteName', {
        header: t('bill.site'), exLabel: t('bill.site'),
        cell: cell => <div style={{maxWidth: 180}}>{cell.getValue()}</div>,
        size: 150, minSize: 40,  maxSize: 400
      }),
      columnHelper.accessor('txnAmount', {
        header: <div style={{textAlign: 'right', flex: 1}}>{t('customer.amount')}</div>,
        exLabel: t('customer.amount'), size: 120, minSize: 40,  maxSize: 400,
        cell: props => <div style={{textAlign: 'right', flex: 1, paddingRight: 15, color: props?.row?.original?.txnType === 'D' ? 'var(--danger-color)' : 'var(--config-color)'}}>
          <Money value={props?.getValue()} />
          </div>,
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          return <div style={{textAlign: 'right', flex: 1}}><Money value={rows?.reduce((acc, cur) => acc + cur?.original?.txnAmount, 0)} /></div>
        },
      }),
      columnHelper.accessor('descr', { header: t('customer.descr'), exLabel: t('customer.descr'), size: 100, minSize: 40,  maxSize: 400 }),
    ]);
    return () => {};
  }, [i18n?.language]);

  const onClickLink = cell => {
    let msg = cell?.row?.original?.merchantId + '-' + cell?.row?.original?.siteId + '-' + cell?.row?.original?.salesNo
    let code = encrypt(msg);
    let url = domain + '/Bill?billno=' + encodeURIComponent(code);
    window.open(url);
  }

  const tableInstance = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { sorting: [{ id: 'salesDate', desc: true }] }
  });
  const tableProps = { tableInstance, hasFooter: true };

  return (
    <div style={{overflowX: 'scroll'}} >
      <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight: 'calc(90vh - 220px)', minWidth: 320 }}>
        {data?.length ? <TableRowResize {...tableProps} /> : <Empty1 />} 
      </div>
    </div>
  );
}