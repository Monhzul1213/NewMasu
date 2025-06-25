import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { DynamicAIIcon } from "./DynamicIcon";

export function Search(props){
  const { showSearch, setShowSearch, handleEnter, search, setSearch, width, className } = props;
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if(showSearch) inputRef?.current?.focus();
    return () => {};
  }, [showSearch]);

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      e?.preventDefault();
      handleEnter && handleEnter(search);
    }
  }

  const onChange = e => setSearch(e.target.value);

  const onClose = () => {
    setShowSearch(!showSearch);
    setSearch('');
    handleEnter && handleEnter('', true)
  }

  const style = { width, overflow: 'hidden', transition: 'width 0.2s ease-in', height: 40 };

  return (
    <div className={className ?? 'ih_search_back'} style={style}>
      <DynamicAIIcon className='ih_input_icon' name='AiOutlineSearch' />
      <input
        className='ih_input'
        ref={inputRef}
        onKeyDown={onKeyDown}
        placeholder={t('page.search')}
        value={search}
        onChange={onChange} />
      <DynamicAIIcon className='ih_input_close' name='AiFillCloseCircle' onClick={onClose} />
    </div>
  );
}

export function Search1(props){
  const { search, setSearch, handleEnter, width } = props;
  const { t } = useTranslation();

  const onKeyDown = e => {
    if(e?.key?.toLowerCase() === "enter"){
      e?.preventDefault();
      handleEnter && handleEnter(search);
    }
  }

  const onChange = e => setSearch(e.target.value);

  const onClear = () => {
    setSearch('');
    handleEnter && handleEnter('', true);
  }

  return (
    <div className="search1" style={{ width }}>
      <DynamicAIIcon className='search1_icon' name='AiOutlineSearch' />
      <input
        className='search1_input'
        onKeyDown={onKeyDown}
        placeholder={t('page.search')}
        value={search}
        onChange={onChange} />
      {search ? <DynamicAIIcon className='search1_icon_clear' name='AiOutlineClose' onClick={onClear} /> : null}
    </div>
  );
}