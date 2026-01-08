import React, { useEffect, useState } from "react";
import { Switch } from "antd";
import { useTranslation } from 'react-i18next';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import useMeasure from "react-use-measure";

import { CellItem, CellMoney, CellQty, DynamicBSIcon, Insert, Money, Pagination, Table } from "../../../all";

export function InventoryCardKit(props){
  const { isKit, setIsKit, isUseTime, setCost, search, setSearch, total, setTotal, data, setData, setEdited, setDKits } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [ref, bounds] = useMeasure();
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('name', {
        header: t('inventory.t_comp'),
        cell: cell => <CellItem item={cell?.row?.original} />,
      }),
      columnHelper.accessor('qty', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.t_qty')}</div>,
        cell: cell => <CellQty {...cell} width={80} />,
        meta: { style: { width: 100, minWidth: 100 } }
      }),
      columnHelper.accessor('cost', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>,
        cell: cell => <CellMoney {...cell} width={80} />,
        meta: { style: { width: 100, minWidth: 100 } }
      }),
      columnHelper.accessor('delete', {
        id: 'delete-col',
        header: '',
        cell: ({ row, table }) => (
          <div className='ac_delete_back'>
            <DynamicBSIcon name='BsTrashFill' className='ac_delete' onClick={() => table?.options?.meta?.onClickDelete(row)} />
          </div>
        ),
        enableSorting: false,
        meta: { style: { width: 40 } }
      }),
    ]);
    return () => {};
  }, [i18n?.language]);

  const onChangeKit = value => {
    setIsKit(value);
    setCost({ value: value ? total : 0 });
    setSearch({ value: null });
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let total = 0;
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        let qty = columnId === 'qty' ? parseFloat(value ? value : 0) : old[rowIndex]?.qty;
        let cost = columnId === 'cost' ? parseFloat(value ? value : 0) : old[rowIndex]?.unitCost;
        let totalCost = qty * cost;
        total += totalCost;
        return { ...old[rowIndex], qty, cost, totalCost };
      } else {
        total += (row.totalCost ?? 0);
        return row;
      }
    }));
    setTotal(total);
    setCost({ value: total });
    setEdited && setEdited(true);
    setSearch({ value: null });
  }

  const onClickDelete = row => {
    if(row?.original?.kitId || row?.original?.kitId === 0) setDKits(old => [...old, row?.original]);
    let newTotal = total - (row?.original?.totalCost ?? 0);
    setTotal(newTotal);
    setCost({ value: newTotal });
    setData(data?.filter(item => item?.invtId !== row?.original?.invtId));
    setSearch({ value: null });
  }

  const makeNewItem = invt => {
    return { invtId: invt.invtId, name: invt.name, qty: 0, cost: 0, unitCost: invt.cost };
  }

  const tableInstance = useReactTable({
    data, columns,
    state: { sorting },
    initialState: { pagination: { pageIndex: 0, pageSize: 25 } },
    autoResetPageIndex: false,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { updateMyData, onClickDelete }
  });
  const tableProps = { tableInstance };
  const selectProps = { search, setSearch, data, setData, makeNewItem };
  const classPage = bounds?.width > 510 ? 'ii_page_row_large' : 'ii_page_row_small';
  
  return (
    <div className='ia_back' ref={ref}>
      <p className='ac_title'>{t('inventory.title')}</p>
      <div className='ac_lbl_back'>
        <p className='ac_lbl'>{t('inventory.is_pack')}</p>
        <Switch className='a_item_check' checked={isKit} onChange={onChangeKit} disabled={isUseTime ? true : false} />
      </div>
      {isKit && <>
        <div className="i_scroll_table" id='paging'>
          <Table {...tableProps} />
        </div>
        <Insert {...selectProps} />
        <div className={classPage}>
          <Pagination {...tableProps} />
          <p className='ac_page_total'>{t('inventory.total_cost')}: <Money value={total} fontSize={11} /></p>
        </div>
      </>}
    </div>
  );
}