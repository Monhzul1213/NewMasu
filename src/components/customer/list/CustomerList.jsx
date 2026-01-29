import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useDispatch, useSelector } from "react-redux";

import { BillDrawer, Check, Empty1, Money, TableRowResize } from "../../all";
import { CustomerTransaction } from "./CustomerTransaction";
import { getList } from "../../../services";
import moment from "moment";

export function CustomerList(props){
  const { pgWidth, data, columns, setColumns, setShow, onClickAdd, rowSelection, setRowSelection, setError, onSearch, error} = props;
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [saleSelected, setSaleSelected] = useState(null);
  const [maxHeight, setMaxHeight] = useState(120);
  const columnHelper = createColumnHelper();
  const [user, token] = useSelector(state => [state.login.user, state.login.token]);
  const dispatch = useDispatch();

  useEffect(() => {
    let height1 = 'calc(100vh - var(--header1-height) - var(--page-padding) * 2', height2 = '';
    if(pgWidth >= 1200) height2 = ' - var(--filter-height)';
    if(pgWidth < 1200 && pgWidth >= 1090) height2 = ' - var(--filter-height) * 2 - 10px';
    if(pgWidth < 1090 && pgWidth >= 766) height2 = ' - var(--filter-height) * 2 - 10px';
    if(pgWidth < 766 && pgWidth >= 422) height2 = ' - var(--filter-height) * 3 - 20px';
    if(pgWidth < 422) height2 = ' - var(--filter-height) * 4 - 40px';
    setMaxHeight(height1 + height2 + ' - 10px' + (error ? ' - 30px)' : ')'));    
    return () => {};
  }, [pgWidth]);

  useEffect(() => {
    setColumns([
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: ({ table }) => <div className="cell_center"><Check checked={table.getIsAllRowsSelected()} onClick={table.getToggleAllRowsSelectedHandler()} /></div>,
        cell: ({ row }) => <div className="cell_center"><Check checked={row.getIsSelected()} onClick={row.getToggleSelectedHandler()} /></div>,
        enableSorting: false, size: 40, minSize: 40,  maxSize: 40,
        meta: { noClick: true }
      }),
      columnHelper.accessor('typeName', {
        header: t('customer.t_type'), exLabel: t('customer.t_type'),
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          return <div style={{textAlign: 'left', minWidth: 84}}>{t('customer.total') + rows?.length}</div>
        }, size: 100, minSize: 40,  maxSize: 400
      }),
      columnHelper.accessor('custName', { header: t('customer.t_name'), exLabel: t('customer.t_name'), size: 200, minSize: 40,  maxSize: 400 }), 
      columnHelper.accessor('custCode', {
        header: <div style={{textAlign: 'right'}}>{t('customer.code')}</div>,
        exLabel: t('customer.code'),
        cell: props => <div style={{textAlign: 'right', paddingRight: 15}}>{props.getValue()}</div>, size: 100, minSize: 40,  maxSize: 400
      }),      
      columnHelper.accessor('phone', { header: t('customer.t_phone'), exLabel: t('customer.t_phone'), size: 80, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('arBalanceMaxLimit', {
        header: <div style={{textAlign: 'right'}}>{t('customer.receivable_limit')}</div>,
        exLabel: t('customer.receivable_limit'),
        cell: cell => (
          <div style={{textAlign: 'right', paddingRight: 15}}><Money value={cell.getValue()} /></div>
        ), size: 120, minSize: 40,  maxSize: 400,
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = useMemo(() => rows?.reduce((sum, row) => row.getValue('arBalanceMaxLimit') + sum, 0), [rows]);
          return <div style={{textAlign: 'right', paddingRight: 15}}><Money value={total}/></div>
        }
      }),
      columnHelper.accessor('arBalance', {
        header: <div style={{textAlign: 'right'}}>{t('customer.receivable')}</div>,
        exLabel: t('customer.receivable'),
        cell: cell => (
          <div style={{textAlign: 'right', paddingRight: 15}} className='table_link' onClick={() => onClickLink(cell, setVisible)}><Money value={cell.getValue()} /></div>
        ), size: 120, minSize: 40,  maxSize: 400,
        meta: { onClickLink, noClick: true, setVisible, style: { width: 110 } },
        footer: ({ table }) => {
          const rows = table.getFilteredRowModel().rows;
          const total = useMemo(() => rows?.reduce((sum, row) => row.getValue('arBalance') + sum, 0), [rows]);
          return <div style={{textAlign: 'right', paddingRight: 15}}><Money value={total}/></div>
        }
      }),
      columnHelper.accessor('lastSalesDate', { header: <span style={{minWidth: 120}}>{t('customer.lastSalesDate')}</span>, exLabel: t('customer.lastSalesDate'), 
        size: 140, minSize: 40,  maxSize: 400 ,
        cell: cell => (
          <div style={{color: cell?.row?.original?.datediff > 14 ? 'var(--danger-color)' : 'var(--text-color)'}}>{cell.getValue()}</div>
        )
      }),
      columnHelper.accessor('datediff', { header: <span style={{minWidth: 120}}>{t('customer.dateDiff')}</span>, exLabel: t('customer.dateDiff'), 
        size: 200, minSize: 40,  maxSize: 400 ,
        cell: cell => <div style={{color: cell.getValue() > 14 ? 'var(--danger-color)' : 'var(--text-color)'}}>{cell.getValue()}</div>
      }),
      columnHelper.accessor('lastSalesNo', { header: <span style={{minWidth: 120}}>{t('customer.lastSalesNo')}</span>, exLabel: t('customer.lastSalesNo'), 
        size: 140, minSize: 40,  maxSize: 400,
        cell: cell => (
          <div className='table_link' onClick={() => onClickSales(cell?.row, setVisible)}>{cell.getValue()}</div>
        ), 
        meta: { onClickSales, noClick: true, setOpen, style: { width: 110 } }
      }),
      columnHelper.accessor('branchName', { header: <span style={{minWidth: 120}}>{t('customer.city')}</span>, exLabel: t('customer.city'), size: 120, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('subBranchName', { header: <span style={{minWidth: 100}}>{t('customer.district')}</span>, exLabel: t('customer.district'), size: 120, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('zoneName', { header: <span style={{minWidth: 100}}>{t('customer.zone')}</span>, exLabel: t('customer.zone'), size: 135, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('address', { header: t('customer.address'), exLabel: t('customer.address'), size: 120, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('email', { header: t('customer.mail'), exLabel: t('customer.mail'), size: 120, minSize: 40,  maxSize: 400 }),
      columnHelper.accessor('note', { header: t('order.note'), exLabel: t('order.note'), size: 120, minSize: 40,  maxSize: 400 }),
    ]);
    return () => {};
  }, [i18n?.language]);

  useEffect(() => {
    setShow(Object.values(rowSelection)?.length ? true : false);
    return () => {};
  }, [rowSelection]);

  const onClickLink = (cell, setVisible) => {
    setVisible(true);
    setSelected(cell?.row?.original);
  }

  const onClickSales = async (row) => {
    // setLoading(true);
    setError(null);
    let query = '?BeginDate=' + moment('2021.01.01')?.format('yyyy.MM.DD') + '&EndDate=' + moment()?.endOf('day')?.format('yyyy.MM.DD');
    const api = 'Sales/GetSales' + query;
    const response = await dispatch(getList(user, token, api,));        
    if (response?.error) {
      setError(response?.error);
    } else {
      response?.data?.salesResp?.forEach(element => {
        if(element?.sale?.salesNo === row?.original?.lastSalesNo) {
          setSaleSelected({sale: element?.sale, saleitem: element?.saleitem, paymentitem: element?.paymentitem});
        }
      })
    }
    // setLoading(false);
    setOpen(true);
  }

  const tableInstance = useReactTable({
    data, columns,
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: row => row.custId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const tableProps = { tableInstance, onRowClick: onClickAdd, hasFooter: true };
  const transProps = { visible, setVisible, selected, onSearch };
  const drawerProps = { selected: saleSelected, open, setOpen };
  
  return (
    <div>
      {visible && <CustomerTransaction {...transProps} />}
      {open && <BillDrawer {...drawerProps} />}
      {!data?.length ? <Empty1 icon='MdSupervisorAccount' /> : 
        <div style={{overflow: 'scroll'}} >
          <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 520 }}>
            <TableRowResize {...tableProps} />
          </div>
        </div>
      }
    </div>
  );
}