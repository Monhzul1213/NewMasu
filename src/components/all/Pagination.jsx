import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Select } from 'antd';
import { useTranslation } from "react-i18next";

// import '../../css/table.css';
const { Option } = Select;

export function Pagination(props){
  const { tableInstance, hasTotal, total, showTotal, size } = props;
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const pageRange = size ? [1000, 3000, 5000] : [10, 25, 50, 100];
  const pageSize = tableInstance.getState().pagination.pageSize;
  const pageIndex = tableInstance.getState().pagination.pageIndex;

  useEffect(() => {
    setPage(pageIndex + 1);
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
    return () => {};
  }, [pageIndex]);

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)){
      setPage('');
    } else if(value <= tableInstance.getPageCount()){
      setPage(value);
    }
  }

  const onBlur = () => {
    tableInstance.setPageIndex(page ? page - 1 : 0);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur();
  }

  let first = pageIndex * pageSize + 1;
  let last = (((pageIndex + 1) * pageSize) < total) ? ((pageIndex + 1) * pageSize) : total;

  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={!tableInstance.getCanPreviousPage()} onClick={() => tableInstance.previousPage()}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {tableInstance.getPageCount()}</p>
      </div>
      <button className='pg_btn' disabled={!tableInstance.getCanNextPage()} onClick={() => tableInstance.nextPage()}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div style={{padding: 5}} />
      {hasTotal && <p className='page_showing'>{first}-{last} of {total}</p>}
      {showTotal && <p className='data_size_text'>{t('customer.total') + total}</p>}
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageSize}
          onSelect={e => tableInstance.setPageSize(Number(e))}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>);
          })}
        </Select>
      </div>
    </div>
  );
}

export function Pagination1(props){
  const { total, setStart, setEnd, size } = props;
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(size ? size : 10);
  const [count, setCount] = useState(1);
  const pageRange = [10, 25, 50, 100];

  useEffect(() => {
    onSizeChange(pageSize, total);
    return () => {};
  }, [total]);

  const onClick = newPage => {
    setPage(newPage);
    setStart((newPage - 1) * pageSize);
    setEnd(newPage * pageSize);
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
  }

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)){
      setPage('');
    } else if(value <= count){
      setPage(value);
    }
  }

  const onBlur = () => {
    onClick(page ? page : 1);
  }

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur();
  }

  const onSizeChange = (size, total1) => {
    setPageSize(size);
    setCount(Math.ceil(total1 / size));
    let start = (page - 1) * size;
    if(start >= total1){
      setPage(1);
      setStart(0);
      setEnd(size);
    } else {
      setStart(start);
      setEnd(page * size);
    }
    const scroll = document.getElementById('paging');
    if(scroll) scroll.scrollTop = 0;
  }
  
  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={page <= 1} onClick={() => onClick(page - 1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={page} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {count}</p>
      </div>
      <button className='pg_btn' disabled={page >= count} onClick={() => onClick(page + 1)}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageSize}
          onSelect={e => onSizeChange(Number(e), total)}>
          {pageRange?.map(item => <Option key={item} value={item}>{item}</Option>)}
        </Select>
      </div>
    </div>
  );
}

export function Pagination2(props){
  const { pageInfo, getInventory, total, showTotal, size } = props;
  const { t } = useTranslation();
  const [value, setValue] = useState(1);
  const pageRange = size ? [1000, 3000, 5000] : [10, 25, 50, 100];
  const page = pageInfo?.pageNumber ?? 1;
  const count = pageInfo?.totalPage ?? 1;

  useEffect(() => {
    setValue(pageInfo?.pageNumber);
    return () => {};
  }, [pageInfo?.pageNumber]);

  const onClick = pageNumber => getInventory({...pageInfo, pageNumber });

  const onChange = e => {
    let value = parseInt(e.target.value);
    if(isNaN(value)) setValue('');
    else setValue(value)
  }

  const onBlur = () => onClick(value ? value : 1);

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter") e.target.blur();
  }

  const onSizeChange = pageSize => getInventory({...pageInfo, pageNumber: 1, pageSize });

  return (
    <div className='pg_back'>
      <button className='pg_btn' disabled={page <= 1} onClick={() => onClick(page - 1)}>
        <FiChevronLeft className='pg_icon' />
      </button>
      <div className='pg_input_back'>
        <input className='pg_input' value={value} onChange={onChange} onBlur={onBlur} onKeyDown={onKeyDown} />
        <p className='pg_text'>/ {count}</p>
      </div>
      <button className='pg_btn' disabled={page >= count} onClick={() => onClick(page + 1)}>
        <FiChevronRight className='pg_icon' />
      </button>
      <div style={{padding: 5}} />
      {showTotal && <p className='data_size_text'>{t('customer.total') + total}</p>}
      <div className='pg_select_back'>
        <Select
          className='pg_select'
          value={pageInfo?.pageSize}
          onSelect={e => onSizeChange(Number(e))}>
          {pageRange?.map(item => {
            return (<Option key={item} value={item}>{item}</Option>)
          })}
        </Select>
      </div>
    </div>
  );
}