import React, { useState } from "react";

import { ButtonRowAdd, CheckAll, Pagination1 } from "../../all";
import { CategoryItems } from "./CategoryItems";

export function CategoryList(props){
  const { show, setShow, checked, setChecked, data, setData, selected, setSelected, onClickAdd, onClickDelete, setLoading, error } = props;
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(25);

  const onCheckAll = checked => {
    setShow(checked);
    setChecked(checked);
    if(checked){
      let selected = {};
      data?.map(item => selected[item?.categoryId] = true);
      setSelected(selected);
    } else
      setSelected({});
  }

  const onCheck = (category, checked) => {
    let newSelected = {...selected};
    if(checked){
      delete newSelected[category];
      setChecked(false);
      if(!(Object.keys(newSelected))?.length) setShow(false);
    } else {
      newSelected[category] = true;
      setShow(true);
    }
    setSelected(newSelected);
  }

  const addProps = { show, onClickAdd, onClickDelete };
  const checkProps = { checked, onCheckAll };
  const itemProps = { selected, setData, onCheck, setLoading };
  const pageProps = { total: data?.length, setStart, setEnd, size: 25 };

  return (
    <div className='ca_list'>
      <ButtonRowAdd type='category' {...addProps} />
      <div className="gap" />
      <CheckAll type='category' {...checkProps} />
      <div className={error ? 'list_back2' : 'list_back1'} id='paging'>
        <CategoryItems {...itemProps} data={data?.slice(start, end)} onClick={onClickAdd} />
      </div>
      <Pagination1 {...pageProps} />
    </div>
  );
}