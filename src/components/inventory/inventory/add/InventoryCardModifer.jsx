import React, { useState } from "react";
import { Switch } from "antd";
import { useTranslation } from 'react-i18next';

import { Pagination1 } from "../../../all";

export function InventoryCardModifer(props){
  const { data, setData, setEdited } = props;
  const { t } = useTranslation();
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(10);

  const onChange = (row, value) => {
    setData(old => old.map((item, index) => {
      if(row === index) return {...old[index], checked: value};
      return item;
    }));
    setEdited && setEdited(true);
  }

  const renderItem = (item, index) => {
    return (
      <div className='a_item' key={index} style={{marginRight: 5}}>
        <div className='a_item_text'>
          <p className='a_item_title'>{item?.modifer?.modiferName}</p>
          <p className='a_item_sub_title'>{item?.modifer?.options}</p>
        </div>
        <Switch className='a_item_check' checked={item?.checked} onChange={e => onChange(index, e)} />
      </div>
    );
  }

  const maxHeight = 'calc(100vh - var(--header1-height) - var(--page-padding) * 4 - 120px - var(--pg-height))';
  const pageProps = { total: data?.length, setStart, setEnd };

  return (
    <div className='ia_back'>
      <p className='ac_title'>{t('inventory.modifier')}</p>
      <div className='list_back' id='paging' style={{ maxHeight, marginTop: 15, paddingBottom: 4 }}>
        {data?.slice(start, end)?.map(renderItem)}
      </div>
      <Pagination1 {...pageProps} />
    </div>
  );
}