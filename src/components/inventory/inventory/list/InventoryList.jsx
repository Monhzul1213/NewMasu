import React, { useEffect, useState } from "react";
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CellMoney, CellSelect, Check, DynamicFAIcon, Empty1, Money, Pagination, Pagination2, TableDetail } from "../../../all";
import { InventoryDetail } from "./InventoryDetail";

export function InventoryList(props){
  const { pgWidth, data, columns, setColumns, rowSelection, setRowSelection, setShow, updateInventory, categories, onClickAdd, filtering, pageInfo, getInventory,
    vendors} = props;
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState({});
  const [sorting, setSorting] = useState([{ id: 'msInventory_name', desc: false }]);
  const [maxHeight, setMaxHeight] = useState(120);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    let height1 = 'calc(100vh - var(--header1-height) - var(--page-padding) * 2', height2 = '';
    if(pgWidth >= 1090) height2 = ' - var(--filter-height)';
    if(pgWidth < 1090 && pgWidth >= 766) height2 = ' - var(--filter-height) * 2 - 10px';
    if(pgWidth < 766 && pgWidth >= 422) height2 = ' - var(--filter-height) * 3 - 20px';
    if(pgWidth < 422) height2 = ' - var(--filter-height) * 4 - 30px';
    setMaxHeight(height1 + height2 + ' - 57px)');
    return () => {};
  }, [pgWidth]);

  useEffect(() => {
    setColumns([
      columnHelper.accessor('expanded', {
        id: 'expand-col',
        header: '',
        cell: ({ row }) => row.getCanExpand() ? (
          <div className="cell_center">
            <DynamicFAIcon name={row.getIsExpanded() ? 'FaChevronUp': 'FaChevronDown'} className='t_expand' onClick={row.getToggleExpandedHandler()} />
          </div>
        ) : '',
        enableSorting: false,
        meta: { noClick: true, style: { width: 35, minWidth: 35 } }
      }),
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: ({ table }) => <div className="cell_center"><Check checked={table.getIsAllRowsSelected()} onClick={table.getToggleAllRowsSelectedHandler()} /></div>,
        cell: ({ row }) => <div className="cell_center"><Check checked={row.getIsSelected()} onClick={row.getToggleSelectedHandler()} /></div>,
        enableSorting: false,
        meta: { noClick: true, style: { width: 40, minWidth: 40 } }
      }),
      columnHelper.accessor('logo', {
        id: 'image-col',
        header: '',
        cell: ({ row, onClickModal }) => !row?.original?.msInventory?.image ? (
          <div className="cell_center">
            <DynamicFAIcon name={'FaImage'} className='t_image' onClick={e => onClickModal(e, row)}/>
          </div>
        ) : '',
        enableSorting: false,
        meta: { noClick: true, style: { width: 35, minWidth: 35 } }
      }),
      columnHelper.accessor('msInventory.name', { header: t('page.name'), exLabel: t('page.name') }),
      columnHelper.accessor('msInventory.barCode', { header: t('inventory.barcode'), exLabel: t('inventory.barcode') }),
      columnHelper.accessor('msInventory.sku', { header: t('inventory.sku'), exLabel: t('inventory.sku') }),
      columnHelper.accessor('msInventory.categoryId', {
        header: t('category.title'), exLabel: t('category.title'),
        cell: cell => <CellSelect {...cell} data={cell.table.options?.meta?.categories} s_value='categoryId' s_descr='categoryName' width={220} />,
        meta: { noClick: true, style: { width: 240 } }
      }),
      columnHelper.accessor('msInventory.vendId', {
        header: t('bill.vendor'), exLabel: t('bill.vendor'),
        cell: cell => <CellSelect {...cell} data={cell.table.options?.meta?.vendors} s_value='vendId' s_descr='vendName' width={220} />,
        meta: { noClick: true, style: { width: 240 } }
      }),
      columnHelper.accessor('msInventory.price', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>,
        exLabel: t('inventory.price'),
        cell: cell => {
          const hasVariants = cell?.row?.original?.msInventoryVariants?.length;
          return hasVariants ? '' : (<div style={{textAlign: 'right', paddingRight: 15}}><Money value={cell.getValue()} /></div>);
        },
        meta: { style: { width: 100 } }
      }),
      columnHelper.accessor('msInventory.cost', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>,
        exLabel: t('inventory.cost'),
        cell: cell => {
          const hasVariants = cell?.row?.original?.msInventoryVariants?.length;
          const isKit = cell?.row?.original?.msInventory?.isKit === 'Y';
          return hasVariants ? '' : isKit
            ? <div style={{textAlign: 'right', paddingRight: 12}}><Money value={cell.getValue()} fontSize={12} /></div>
            : <CellMoney {...cell} cellID='hide_border' width={80} />
        },
        meta: { noClick: true, style: { width: 100, minWidth: 100 } }
      }),
      columnHelper.accessor('msInventory.margin', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.margin')}</div>,
        exLabel: t('inventory.margin'),
        cell: cell => {
          const hasVariants = cell?.row?.original?.msInventoryVariants?.length;
          return hasVariants ? '' : (<div style={{textAlign: 'right'}}>{cell.getValue()}</div>);
        },
        meta: { style: { width: 90, minWidth: 90 } }
      }),
    ]);
    return () => {};
  }, [i18n?.language]);

  useEffect(() => {
    setShow(Object.values(rowSelection)?.length ? true : false);
    return () => {};
  }, [rowSelection]);

  const updateData = async (row, column, value, e, invvar, isEdit, isExpand) => {
    let item = data[row]?.msInventory;
    let newData = { invtID: item?.invtId, categoryID: item?.categoryId, cost: item?.cost };
    if(column === 'msInventory_categoryId') newData.categoryID = value;
    else if(column === 'msInventory_cost') newData.cost = parseFloat(value ? value : 0);
    else if(column === 'msInventory_vendId') newData.vendId = value;
    else if(invvar) newData.invvar = invvar;
    const response = await updateInventory(newData, true, isExpand);
    return response;
  }

  const renderSubComponent = ({ row }) => {
    return (<InventoryDetail data={row?.original?.msInventoryVariants} index={row?.index} updateData={updateData} />);
  }

  const tableInstance = useReactTable({
    data, columns,
    state: { rowSelection, expanded, sorting },
    initialState: { pagination: { pageIndex: 0, pageSize: 1000 } },
    enableRowSelection: true,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getRowId: row => row?.msInventory?.invtId,
    onExpandedChange: setExpanded,
    getRowCanExpand: row => row?.original?.msInventoryVariants?.length ? true : false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { updateMyData: updateData, categories, vendors }
  });
  const tableProps = { tableInstance, onRowClick: onClickAdd, renderSubComponent };
  const page1Props = { tableInstance, total: data?.length, showTotal: true, size: true };
  const page2Props = { pageInfo, getInventory, total: data?.length, showTotal: true, size: true };

  return (
    <div>
       {!data?.length ? <Empty1 icon='MdOutlineShoppingBasket' /> : 
        <>
          <div style={{overflow: 'scroll'}} >
            <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720 }}>
              <TableDetail {...tableProps} />
            </div>
          </div>
          {filtering ? <Pagination {...page1Props} /> : <Pagination2 {...page2Props} />}
        </>
      }
    </div>
  );
}