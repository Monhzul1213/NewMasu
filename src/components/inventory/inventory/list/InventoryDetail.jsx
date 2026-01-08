import React, { useEffect, useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";

import { CellMoney, Money, TableRow } from "../../../all";
import { InventoryDetailEdit } from "./InventoryDetailEdit";

export function InventoryDetail(props){
  const { data, index, updateData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('expander', { meta: { style: { width: 75 } } }),
      columnHelper.accessor('variantName'),
      columnHelper.accessor('price', {
        cell: cell => <div style={{textAlign: 'right', paddingRight: 15}}><Money value={cell.getValue()} fontSize={12} /></div>,
        meta: { style: { width: 100 } }
      }),
      columnHelper.accessor('cost', {
        cell: cell => <CellMoney {...cell} cellID='hide_border' width={80} />,
        meta: { noClick: true, style: { width: 100 } }
      }),
      columnHelper.accessor('margin', {
        cell: cell => <div style={{textAlign: 'right'}}>{cell.getValue()}</div>,
        meta: { style: { width: 90, minWidth: 90 } }
      }),
    ]);
    return () => {};
  }, [i18n?.language]);

  const onRowClick = row => {
    setVisible(true);
    setSelected(row?.original);
  }

  const updateMyData = (row, column, value) => {
    let variant = {...data[row], rowStatus: 'U', cost: parseFloat(value ? value : 0)};
    updateData(index, null, null, null, variant, false, true);
  }

  const onSave = async variant => {
    const response = await updateData(index, null, null, null, variant, true);
    return response;
  }

  const tableInstance = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel(), meta: { updateMyData } });
  const tableProps = { tableInstance, onRowClick, noHeader: true };
  const editProps = { visible, selected, onSave, setVisible };

  return (
    <div style={{overflowY: 'scroll', maxHeight: 'calc(70vh)'}}>
      {visible && <InventoryDetailEdit {...editProps} />}
      <TableRow {...tableProps} />
    </div>
  );
}