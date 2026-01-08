import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import { Check, TableRow } from '../../../all';

export function PriceModalSites(props){
  const { data, setData } = props;
  const { t, i18n } = useTranslation();
  const [columns, setColumns] = useState([]);
  const columnHelper = createColumnHelper();

  useEffect(() => {
    setColumns([
      columnHelper.accessor('checked', {
        id: 'select-col',
        header: <div className="cell_center" style={{maxWidth: 72}}></div>,
        cell: ({ row, table }) => (
          <div className="cell_center" style={{maxWidth: 72}}>
            <Check checked={row?.original?.checkedS} disabled={row?.original?.checkedSOrg} onClick={e => table?.options?.meta?.onClickCheck(e, row)} />
          </div>
        ),
        meta: { style: { width: 15 } }
      }),
      columnHelper.accessor('name', { header: <div style={{flex: 1}}>{t('inventory.t_site')}</div> }),
    ]);
    return () => {};
  }, [i18n?.language]);


  const onClickCheck = (e, item) => {
    e?.preventDefault();
    setData(old => old.map((row, index) => {
      if (index === item?.index) return { ...old[item?.index], checkedS: !row?.checkedS };
      return row
    }));
  }

  const tableInstance = useReactTable({
    data, columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { onClickCheck }
  });
  const tableProps = { tableInstance, noHeader: true };

  return (
    <div style={{ marginTop: 15 }}>
      <p className='select_lbl'>{t('inventory.sites')}</p>
      <div id='paging' style={{overflowY: 'scroll', maxHeight: 200}}>
        <TableRow {...tableProps} />
      </div>
    </div>
  );
}