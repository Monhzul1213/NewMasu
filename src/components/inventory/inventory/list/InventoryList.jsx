import React, { useEffect, useState } from "react";
import { createColumnHelper, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CellMoney, CellSelect, Check, DraggableTable, DynamicFAIcon, Empty1, Money, Pagination, Pagination2, TableDetail, TableRowResize } from "../../../all";
import { InventoryDetail } from "./InventoryDetail";
import { useDispatch, useSelector } from "react-redux";
import { sendRequest } from "../../../../services";
import { InventoryImage } from "./InventoryImage";

export function InventoryList(props){
  const { pgWidth, data, columns, setColumns, rowSelection, setRowSelection, setShow, updateInventory, categories, onClickAdd, filtering, pageInfo, getInventory,
    vendors, setData, error} = props;
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState({});
  // const [sorting, setSorting] = useState([{ id: 'msInventory_viewPriority', desc: false }]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [maxHeight, setMaxHeight] = useState(120);
  const columnHelper = createColumnHelper();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    let height1 = 'calc(100vh - var(--header1-height) - var(--page-padding) * 2', height2 = '';
    if(pgWidth >= 1200) height2 = ' - var(--filter-height) * 2 - 7px';
    if(pgWidth < 1200 && pgWidth >= 1090) height2 = ' - var(--filter-height) * 2 - 8px';
    if(pgWidth < 1090 && pgWidth >= 766) height2 = ' - var(--filter-height) * 2 - 50px';
    if(pgWidth < 766 && pgWidth >= 422) height2 = ' - var(--filter-height) * 3 - 57px';
    if(pgWidth < 422) height2 = ' - var(--filter-height) * 4 - 66px';
    setMaxHeight(height1 + height2 + ' - 10px' + (error ? ' - 30px)' : ')'));    
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
        enableSorting: false, size: 40, minSize: 40,  maxSize: 40,
        meta: { noClick: true, }
      }),
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: ({ table }) => <div className="cell_center"><Check checked={table.getIsAllRowsSelected()} onClick={table.getToggleAllRowsSelectedHandler()} /></div>,
        cell: ({ row }) => <div className="cell_center"><Check checked={row.getIsSelected()} onClick={row.getToggleSelectedHandler()} /></div>,
        enableSorting: false, size: 45, minSize: 45,  maxSize: 45,
        meta: { noClick: true }
      }),
      columnHelper.accessor('logo', {
        id: 'image-col',
        header: '',
        cell: ({ row }) => row?.original?.msInventory?.image ? (
          <div className="cell_center">
            <DynamicFAIcon name={'FaImage'} className='t_image' onClick={e => onClickModal(e, row)}/>
          </div>
        ) : '',
        enableSorting: false, size: 45, minSize: 45,  maxSize: 45,
        meta: { noClick: true, }
      }),
      columnHelper.accessor('msInventory.name', { header: t('page.name'), exLabel: t('page.name'), size: 300, minSize: 80,
        cell: cell => <div className='table_link' onClick={() => onClickRow(cell?.row)}>{cell.getValue()}</div> }),
      columnHelper.accessor('msInventory.barCode', { header: t('inventory.barcode'), exLabel: t('inventory.barcode'), size: 150, minSize: 80, }),
      // columnHelper.accessor('msInventory.sku', { header: t('inventory.sku'), exLabel: t('inventory.sku'), size: 80, minSize: 50 }),
      columnHelper.accessor('msInventory.categoryId', {
        header: t('category.title'), exLabel: t('category.title'),
        cell: cell => <CellSelect {...cell} data={cell.table.options?.meta?.categories} s_value='categoryId' s_descr='categoryName' width={170} />,
        meta: { noClick: true,}, size: 180, minSize: 100,
      }),
      columnHelper.accessor('msInventory.vendId', {
        header: t('bill.vendor'), exLabel: t('bill.vendor'),
        cell: cell => <CellSelect {...cell} data={cell.table.options?.meta?.vendors} s_value='vendId' s_descr='vendName' width={170} />,
        meta: { noClick: true }, size: 180, minSize: 100,
      }),
      columnHelper.accessor('msInventory.price', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.price')}</div>,
        exLabel: t('inventory.price'), size: 130, minSize: 50,
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
        meta: { noClick: true}, size: 100, minSize: 50,
      }),
      columnHelper.accessor('msInventory.margin', {
        header: <div style={{textAlign: 'right'}}>{t('inventory.margin')}</div>,
        exLabel: t('inventory.margin'),
        cell: cell => {
          const hasVariants = cell?.row?.original?.msInventoryVariants?.length;
          return hasVariants ? '' : (<div style={{textAlign: 'right', marginRight: 15}}>{cell.getValue()}</div>);
        }, size: 100, minSize: 50,
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

  const updateOrder = async (row, from, to) => {
    if (from === to) return;

    const listWithoutRow = data.filter(
      item => item.msInventory.invtId !== row.msInventory.invtId
    );

    const prevItem = to > 0 ? listWithoutRow[to - 1] : null;
    const nextItem =
      to < listWithoutRow.length ? listWithoutRow[to] : null;

    const rowData = [{ fieldName: 'InvtID', value: row.msInventory.invtId }];
    const response = await dispatch(
      sendRequest(user, token, 'Inventory/GetInventory/Custom', rowData)
    );

    const updateData = response?.data?.[0];
    if (!updateData) return;

    let newPriority;

    if (!prevItem && nextItem) {
      newPriority = nextItem.msInventory.viewPriority - 1;
    } else if (prevItem && !nextItem) {
      newPriority = prevItem.msInventory.viewPriority + 1;
    } else if (prevItem && nextItem) {
      newPriority =
        (prevItem.msInventory.viewPriority +
          nextItem.msInventory.viewPriority) / 2;
    }

    const withRowStatusU = (arr = []) =>
      arr.map(item => ({
        ...item,
        rowStatus: 'U'
      }));

    const payload = {
      ...updateData.msInventory,
      viewPriority: newPriority,
      image: updateData.msInventory?.fileRaw ?? {},
      invkite: withRowStatusU(updateData.msInvKitItems),
      invvar: withRowStatusU(updateData.msInventoryVariants),
      invmod: withRowStatusU(updateData.msInventoryModifers),
      invsales: withRowStatusU(updateData.psSalesPrices),
      rowStatus: 'U'
    };

    const res = await dispatch(
      sendRequest(user, token, 'Inventory/UpdateInventory', payload)
    );
    return res;
  };

  const renderSubComponent = ({ row }) => {
    return (<InventoryDetail data={row?.original?.msInventoryVariants} index={row?.index} updateData={updateData} />);
  }

  const onClickModal = (e, row) => {
    e?.preventDefault();
    setVisible(true);
    setSelected(row?.original?.msInventory)
  }

  const closeModal = e => {
    e?.preventDefault();
    setVisible(false);
  }

  const onClickRow = row => onClickAdd(row?.original?.msInventory);

  const tableInstance = useReactTable({
    data, columns,
    state: { rowSelection, expanded },
    initialState: { pagination: { pageIndex: 0, pageSize: 1000 } },
    enableRowSelection: true,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    // onSortingChange: setSorting,
    getRowId: row => row?.msInventory?.invtId,
    onExpandedChange: setExpanded,
    getRowCanExpand: row => row?.original?.msInventoryVariants?.length ? true : false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    meta: { updateMyData: updateData, categories, vendors }
  });
  const tableProps = { tableInstance, renderSubComponent };
  const page1Props = { tableInstance, total: data?.length, showTotal: true, size: true };
  const page2Props = { pageInfo, getInventory, total: data?.length, showTotal: true, size: true };
  const imageProps = { visible, closeModal , selected};

  return (
    <div>
      {visible && <InventoryImage {...imageProps} />}
       {!data?.length ? <Empty1 icon='MdOutlineShoppingBasket' /> : 
        <>
          <div style={{overflow: 'scroll'}} >
            <div className='table_scroll' id='paging' style={{ marginTop: 10, overflow: 'scroll', maxHeight, minWidth: 720 }}>
              <TableRowResize
                {...tableProps}
                TBodyComponent={(props) => (
                  <DraggableTable
                    renderSubComponent={renderSubComponent}
                    data={data}
                    tableInstance={tableInstance}
                    setData={setData}
                    updateOrder={updateOrder}
                  />
                )}
              />
            </div>
          </div>
          {filtering ? <Pagination {...page1Props} /> : <Pagination2 {...page2Props} />}
        </>
      }
    </div>
  );
}