import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { CellMoney, Check, CheckAll, Money, Pagination, Table } from "../../../all";
import { PriceModalSales } from "./PriceModalSales";
import { PriceModalWhole } from "./PriceModalWhole";
import { PriceModalSafe } from "./PriceModalSafe";

export function InventoryCardSite(props){
  const { checked, setChecked, setEdited, data, setData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [visibleSales, setVisibleSales] = useState(false);
  const [visibleWhole, setVisibleWhole] = useState(false);
  const [visibleSafe, setVisibleSafe] = useState(false);
  const [selected, setSelected] = useState(null);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    let columns = [
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: <div className="cell_center" style={{maxWidth: 60}}>{t('inventory.t_choose')}</div>,
        cell: ({ row, table }) => (
          <div className="cell_center">
            <Check checked={row?.original?.checked} onClick={e => table?.options?.meta?.onClickCheck(e, row)} />
          </div>
        ),
        enableSorting: false,
        meta: { style: { width: 65 } }
      }),
      columnHelper.accessor('name', { header: <div style={{flex: 1}}>{t('inventory.t_site')}</div> }),
      columnHelper.accessor('useNhat', {
        header: <div className="cell_center" style={{maxWidth: 88}}>{t('inventory.t_nhat')}</div>,
        cell: ({ row, table }) => {
          let checked = row?.original?.useNhat === 'Y';
          return (
            <div className="cell_center" style={{maxWidth: 60}}>
              <Check checked={checked} onClick={e => table?.options?.meta?.onClickNHAT(e, row, checked)} />
            </div>
          );
        },
        enableSorting: false,
        meta: { style: { width: 90 } }
      }),
      columnHelper.accessor('price', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.t_price')}</div>,
        cell: cell => <CellMoney {...cell} width={80} />,
        enableSorting: false,
        meta: { style: { width: 80, minWidth: 80 } }
      }),
      columnHelper.accessor('salesprice', {
        header: t('inventory.t_salesprice'),
        cell: ({ row, table }) => {
          let checked = row?.original?.useSalesPrice === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center', width: 180 }}>
              <Check checked={checked} onClick={e => table?.options?.meta?.onClickSalesCheck(e, row, checked)} />
              <div style={{marginLeft: 8, flex: 1}} onClick={e => table?.options?.meta?.onClickSales(e, row)}>
                <p style={{margin: 0}}>
                  <Money value={row?.original?.salesPrice}/>
                  <span>{row?.original?.salesLabel}</span>
                </p>
              </div>
            </div>
          );
        },
        enableSorting: false,
        meta: { style: { width: 200 } }
      }),
      columnHelper.accessor('wholeprice', {
        header: t('inventory.t_wholeprice'),
        cell: ({ row, table }) => {
          let checked = row?.original?.useWholePrice === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center' }}>
              <Check checked={checked} onClick={e => table?.options?.meta?.onClickWholeCheck(e, row, checked)} />
              <div style={{marginLeft: 8, flex: 1}} onClick={e => table?.options?.meta?.onClickWhole(e, row)}>
                <p style={{margin: 0}}>
                  <Money value={row?.original?.wholePrice}/>
                  {row?.original?.wholeQty ? (' (' + row?.original?.wholeQty + ')') : ''}
                </p>
              </div>
            </div>
          );
        },
        enableSorting: false,
        meta: { style: { width: 135 } }
      }),
      columnHelper.accessor('minQty', {
        header: t('inventory.safeQty'),
        cell: ({ row, table }) => {
          let checked = row?.original?.useMinQty === 'Y';
          return (
            <div style={{ display: 'flex', flexFlow: 'row', alignItems: 'center' }}>
              <Check checked={checked} onClick={e => table?.options?.meta?.onClickSafeCheck(e, row, checked)} />
              <div style={{marginLeft: 8, flex: 1}} onClick={e => table?.options?.meta?.onClickSafe(e, row)}>
                <p style={{margin: 0}}>{row?.original?.minQty}</p>
              </div>
            </div>
          );
        },
        enableSorting: false,
        meta: { style: { width: 100 } }
      })
    ];
    setColumns(columns);
    return () => {};
  }, [i18n?.language]);

  const onCheckAll = checked => {
    setChecked(checked);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      return { ...old[index], checked };
    }));
  }

  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setChecked(false);
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if(index === item?.index) return { ...old[item?.index], checked: !row?.checked };
      return row;
    }));
  }

  const onClickNHAT = (e, item, checked) => {
    e?.preventDefault();
    setEdited && setEdited(true);
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], useNhat: checked ? 'N' : 'Y' };
      return row
    }));
  }

  const updateMyData = (rowIndex, columnId, value, e) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if(index === rowIndex){
        if(columnId === 'price') return { ...old[rowIndex], [columnId]: value, changed: true };
        return { ...old[rowIndex], [columnId]: value };
      }
      return row
    }));
    setEdited && setEdited(true);
  }

  const onClickSalesCheck = (e, item, checked) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      if(checked){
        setData(old => old.map((row, index) => {
          if(index === item?.index)
            return { ...old[item?.index], useSalesPrice: checked ? 'N' : 'Y', salesPrice: 0, salesLabel: "", salesTimeLimited: "N" };
          else
            return row
        }));
      } else {
        setVisibleSales(true);
        setSelected(item);
      }
    }
  }

  const onClickSales = (e, item) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      setVisibleSales(true);
      setSelected(item);
    }
  }

  const closeSales = () => {
    setVisibleSales(false);
    setSelected(null);
  }

  const onClickWholeCheck = (e, item, checked) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      if(checked){
        setData(old => old.map((row, index) => {
          if(index === item?.index) return { ...old[item?.index], useWholePrice: checked ? 'N' : 'Y', wholePrice: 0, wholeQty: 0 };
          return row
        }));
      } else {
        setVisibleWhole(true);
        setSelected(item);
      }
    }
  }

  const onClickWhole = (e, item) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      setVisibleWhole(true);
      setSelected(item);
    }
  }

  const closeWhole = () => {
    setVisibleWhole(false);
    setSelected(null);
  }

  const onClickSafeCheck = (e, item, checked) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      if(checked){
        setData(old => old.map((row, index) => {
          if(index === item?.index) return { ...old[item?.index], useMinQty: checked ? 'N' : 'Y', minQty: 0 };
          return row
        }));
      } else {
        setVisibleSafe(true);
        setSelected(item);
      }
    }
  }

  const onClickSafe = (e, item) => {
    e?.preventDefault();
    if(item?.original?.checked){
      setEdited && setEdited(true);
      setVisibleSafe(true);
      setSelected(item);
    }
  }

  const closeSafe = () => {
    setVisibleSafe(false);
    setSelected(null);
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
    meta: { onClickCheck, onClickNHAT, updateMyData, onClickSalesCheck, onClickSales, onClickWholeCheck, onClickWhole, onClickSafeCheck, onClickSafe }
  });
  const tableProps = { tableInstance };
  const modalSalesProps = { visibleSales, closeSales, selected, data, setData };
  const modalWholeProps = { visibleWhole, closeWhole, selected, data, setData };
  const modalSafeProps = { visibleSafe, closeSafe, selected, data, setData };
  
  return (
    <div className='ia_back'>
      {visibleSales && <PriceModalSales {...modalSalesProps} />}
      {visibleWhole && <PriceModalWhole {...modalWholeProps} />}
      {visibleSafe && <PriceModalSafe {...modalSafeProps} />}
      <p className='ac_title'>{t('inventory.sites')}</p>
      <div style={{padding: 5}} />
      <CheckAll type='inventory' checked={checked} onCheckAll={onCheckAll} style={{ border: 'none' }} />
      <div className='table_scroll' style={{overflowX: 'scroll'}}>
        <div id='paging' className="i_scroll_table" style={{ minWidth: 860 }}>
          <Table {...tableProps} />
        </div>
      </div>
      <Pagination {...tableProps} />
    </div>
  );
}