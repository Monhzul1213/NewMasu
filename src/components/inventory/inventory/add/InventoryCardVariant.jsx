import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { CellInput, CellMoney, DynamicBSIcon, Input, Memo, Pagination, Table } from "../../../all";

export function InventoryCardVariant(props){
  const { data, setData, search, setSearch, isUseTime, setEdited, price, cost, disabled, setDisabled, setDVariants } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('variantName', {
        header: t('inventory.t_variant'),
        cell: cell => <CellInput {...cell} />,
        meta: { style: { paddingRight: 18 }, length: 30 }
      }),
      columnHelper.accessor('price', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>,
        cell: cell => <CellMoney {...cell} width={80} />,
        meta: { style: { paddingRight: 18, width: 100 } }
      }),
      columnHelper.accessor('cost', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.cost')}</div>,
        cell: cell => <CellMoney {...cell} width={80} />,
        meta: { style: { paddingRight: 18, width: 100 } }
      }),
      columnHelper.accessor('sku', {
        header: t('inventory.sku'),
        cell: cell => <CellInput {...cell} width={100} />,
        meta: { style: { paddingRight: 18, width: 120 }, length: 30 }
      }),
      columnHelper.accessor('barCode', {
        header: t('inventory.barcode'),
        cell: cell => <CellInput {...cell} width={100} />,
        meta: { style: { paddingRight: 18, width: 120 }, length: 30 }
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

  const handleEnter = e => {
    e?.preventDefault();
    let variantName = search?.value?.trim();
    if(variantName){
      let exists = data?.findIndex(d => d.variantName?.toLowerCase() === variantName?.toLowerCase());
      if(exists === -1){
        let item = { variantName, price: price?.value ?? 0, cost: cost?.value ?? 0, sku: '', barCode: '' };
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else
        setSearch({ value: search?.value?.trim(), error: t('inventory.variant_error') });
    }
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let hasError = false, errorIndex = -1;
    if(columnId === 'variantName' || columnId === 'sku'){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'variantName') hasError = true;
    }
    setDisabled(hasError);
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], [columnId]: value, error: hasError ? columnId : null };
      } else if(hasError && errorIndex === index){
        return {...old[index], error: columnId };
      } else {
        return {...old[index], error: null };
      }
    }));
    setEdited && setEdited(true);
  }

  const onClickDelete = row => {
    if(row?.original?.variantId || row?.original?.variantId === 0) setDVariants(old => [...old, row?.original]);
    if(row?.original?.error){
      setDisabled(false);
      setData(old => old?.reduce(function(list, item, index){
        if(index !== row?.index){
          item.error = null;
          list.push(item);
        }
        return list;
      }, []));
    } else {
      setData(data?.filter((item, index) => row?.index !== index));
    }
    setSearch({ value: search?.value });
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
    meta: { updateMyData, onClickDelete, disabled }
  });
  const tableProps = { tableInstance };
  
  return (
    <div>
      <div className='ia_back'>
        <p className='ac_title'>{t('inventory.variant')}</p>
        <div className="i_scroll_table" id='paging'>
          <Table {...tableProps} />
        </div>
        <div style={{padding: 2}} />
        <Input
          placeholder={t('inventory.add_variant')}
          value={search}
          setValue={setSearch}
          inRow={true} length={30}
          handleEnter={handleEnter}
          disabled={isUseTime ? true : false} />
        <div style={{padding: 5}} />
        <Pagination {...tableProps} />
      </div>
      <Memo text={t('inventory.variant_memo')} />
    </div>
  );
}