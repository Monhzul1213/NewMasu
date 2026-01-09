import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import moment from 'moment';

import { getList } from "../../../services";
import { domain, encrypt } from "../../../helpers";
import { Empty1, Error, ExportExcel, Overlay, Money, PlainRange, TableFooter } from "../../all";

export function CustomerTransaction(props){
  const { visible, setVisible, selected } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [date, setDate] = useState([moment().startOf('month'), moment()]);
  const [columns, setColumns] = useState([]);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let query = '?BeginDate=' + moment().startOf('month')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.format('yyyy.MM.DD') + '&custId=' + selected?.custId;
    getData(query);
    return () => {};
  }, []);

  const getData = async query => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Site/GetCustomerTxn' + (query ?? '')));
    if(response?.error) setError(response?.error);
    else {
      setData(response?.data?.txnLists);
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

  const onCancel = () => setVisible(false);

  const renderItem = (item, index) => {
    return (  
      <div className='sub_row1' key={index}>
        <p className='sub_row_value'>
          {item?.txnType === 'D' ? t('customer.create') : t('customer.close')}
          <Money value={item?.amount} fontSize={13} />
        </p>
      </div>
    );
  }

  const listProps = { columns, setColumns, data };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} onCancel={onCancel} centered={true} width={770}>
      <Overlay loading={loading}>
        <div className='m_back2'>
          <p className='es_title'>{t('customer.cus_trans')}</p>
          <div className='sub_title'>
            <div className='sub_row1'>
              {data1?.map(renderItem)}
            </div>
            <div className='sub_row'>
              <p className='sub_row_value'>{t('customer.balance')}<Money value={selected?.arBalance ?? 0} fontSize={13} /></p> 
            </div>
          </div>
          <div className="row_between">
            <PlainRange
              className='rh_date'
              label={t('page.date')}
              value={date}
              setValue={setDate}
              onHide={onHide} />
            <ExportExcel
              text={t('page.export')}
              className='rp_list_select1'
              columns={columns}
              excelData={data}
              excelName={t('customer.cus_trans')} />
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
        },
        meta: { style: { width: 72 }},
      }),
      columnHelper.accessor('salesNo', {
        header: t('customer.salesNo'), exLabel: t('customer.salesNo'),
        cell: cell => (
          <div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(cell)}>{cell.getValue()}</div>
        ),
        meta: { onClickLink, noClick: true, style: { maxWidth: 130 } },
      }),
      columnHelper.accessor('siteName', {
        header: t('customer.address'), exLabel: t('customer.address'),
        cell: cell => <div style={{maxWidth: 180}}>{cell.getValue()}</div>
      }),
      columnHelper.accessor('custName', { header: t('customer.t_name'), exLabel: t('customer.t_name') }),
      columnHelper.accessor('txnTypeName', {
        header: t('customer.t_type'), exLabel: t('customer.t_type'),
        cell: cell => <div style={{width: 140}}>{cell.getValue()}</div>
      }),
      columnHelper.accessor('txnAmount', {
        header: <div style={{textAlign: 'right', flex: 1}}>{t('customer.amount')}</div>,
        exLabel: t('customer.amount'),
        cell: props => <div style={{textAlign: 'right', flex: 1}}><Money value={props?.getValue()} fontSize={12} /></div>,
      }),
      columnHelper.accessor('descr', { header: t('customer.descr'), exLabel: t('customer.descr') }),
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
  const tableProps = { tableInstance };

  return (
    <div style={{overflowX: 'scroll'}} >
      <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight: 'calc(90vh - 220px)', minWidth: 320 }}>
        {data?.length ? <TableFooter {...tableProps} /> : <Empty1 />} 
      </div>
    </div>
  );
}