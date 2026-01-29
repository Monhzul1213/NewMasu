import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';

import { Input, Table, Pagination, DynamicBSIcon, CellMoney, CellInput } from '../../all';

export function ModifierCardOption(props){
  const { name, setName, setError, data, setData, setDItems, setEdited, disabled, setDisabled, search, setSearch } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('delete', {
        id: 'delete-col',
        header: '',
        cell: ({ row, table }) => (
          <div className='ac_delete_back'>
            <DynamicBSIcon name='BsDashCircleFill' className='ac_delete' onClick={() => table?.options?.meta?.onClickDelete(row)} />
          </div>
        ),
        enableSorting: false, size: 40,
        meta: { style: { width: 40 } }
      }),
      columnHelper.accessor('optionName', { header: t('page.name'),
        cell: cell => <CellInput {...cell} width={320}/>,
        meta: { style: { width: 320, minWidth: 200 } }
      }),
      columnHelper.accessor('price', { header: t('customer.amount'), exLabel: t('customer.amount'),
        cell: cell => <CellMoney {...cell} width={130} />,
        meta: { style: { width: 130, minWidth: 100 } } 
      }),    ]);
    return () => {};
  }, [i18n?.language]);

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    let hasError = false, errorIndex = -1;
    if(columnId === 'optionName'){
      errorIndex = data?.findIndex((item, index) =>
        value && index !== rowIndex && item[columnId]?.trim()?.toLowerCase() === value?.trim()?.toLowerCase());
      hasError = errorIndex !== -1;
      if(!value && columnId === 'optionName') hasError = true;
    }
    setDisabled(hasError);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        return { ...old[rowIndex], [columnId]: value, error: hasError ? columnId : null };
      } else if(hasError && errorIndex === index){
        return {...old[index], error: columnId };
      } else {
        return {...old[index], error: null };
      }
    }));
  }

  const onClickDelete = row => {
    if(row?.original?.rowStatus !== 'I') setDItems(old => [...old, row?.original]);
    if(row?.original?.error){
      setDisabled(false);
      setData(old => old?.reduce(function(list, item, index) {
        if(index !== row?.index){
          item.error = null;
          list.push(item);
        }
        return list;
      }, []));
    } else {
      setData(data?.filter((item, index) => row?.index !== index))
    }
    setSearch({ value: search?.value });
    setEdited && setEdited(true);
  }

  const handleEnter = e => {
    e?.preventDefault();
    let optionName = search?.value?.trim();
    if(optionName){
      let exists = data?.findIndex(d => d.optionName?.toLowerCase() === optionName?.toLowerCase());
      if(exists === -1){
        let item = { optionName, price: 0, rowStatus: 'I', modifireItemID: -1 };
        setData(old => [...old, item]);
        setSearch({ value: '' });
        setEdited && setEdited(true);
      } else setSearch({ value: search?.value?.trim(), error: t('modifier.option_error') });
    }
  }

  const nameProps = { value: name, setValue: setName, label: t('modifier.name'), placeholder: t('modifier.name'), setError, inRow: true, setEdited, length: 20 };
  const maxHeight = 'calc(100vh - var(--header-height) - var(--page-padding) * 4 - 190px - var(--pg-height))';
  const tableInstance = useReactTable({
    data, columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { onClickDelete, updateMyData }
  });

  const tableProps = { tableInstance };
  
  const addProps = { value: search, setValue: setSearch, placeholder: t('modifier.new'), handleEnter, inRow: true, length: 20 };

  return (
    <div className='ia_back' style={{maxWidth: 'var(--empty-width)'}}>
      <Input {...nameProps} />
      <div style={{padding: 7}} />
      <div id='paging' style={{overflowY: 'scroll', maxHeight}}>
        <Table {...tableProps} />
      </div>
      <div style={{padding: 2}} />
      <Input {...addProps} />
      <div style={{padding: 5}} />
      <Pagination {...tableProps} />
    </div>
  )
}
