import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { getServiceBar } from "../../../services";
import { Button, ButtonRowAdd, ExportExcel, PlainSelect, Search1 } from "../../all";

export function CustomerFilter(props){
  const { pgWidth, show, data, columns, setError, onClickAdd, onClickDelete, onClickImport, getData } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState(-1);
  const [branches, setBranches] = useState([]);
  const [allBranches, setAllBranches] = useState([]);
  const [subBranch, setSubBranch] = useState(-1);
  const [subBranches, setSubBranches] = useState([]);
  const [isAr, setIsAr] = useState(-1);
  const [isArs, setIsArs] = useState([]);
  const [search, setSearch] = useState('');
  const [width, setWidth] = useState({ });
  const dispatch = useDispatch();

  useEffect(() => {
    if(pgWidth >= 1240) setWidth({ search: 400, picker: 162 });
    else if(pgWidth < 1240 && pgWidth >= 1090) setWidth({ search: pgWidth - 840, picker: 162 });
    else if(pgWidth < 1090 && pgWidth >= 766) setWidth({ search: pgWidth - 516, picker: 162 });
    else if(pgWidth < 766 && pgWidth >= 594) setWidth({ search: pgWidth - 344, picker: 162 });
    else if(pgWidth < 594 && pgWidth >= 422) setWidth({ search: pgWidth - 172, picker: 162 });
    else if(pgWidth < 422) setWidth({ search: pgWidth, picker: (pgWidth - 10) / 2 });
    return () => {};
  }, [pgWidth]);

  useEffect(() => {
    onFocusBranch();
    onFocusIsAr();
    setSubBranches([{ subBranchCode: -1, subBranchName: t('customer.all_district') }])
    return () => {};
  }, []);

  const onFocusBranch = async () => {
    if(!branches?.length || branches?.length === 1){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getServiceBar('getBranchInfo'));
      if(response?.error) setError && setError(response?.error);
      else {
        let data = [{ branchCode: -1, branchName: t('customer.all_city') }];
        response?.data?.data?.forEach(item => {
          let index = data?.findIndex(list => item.branchCode === list.branchCode);
          if(index === -1) data.push(item);
        });
        setBranches(data?.sort((a, b)=> a?.branchCode - b?.branchCode));
        setAllBranches(response?.data?.data);
      }
      setLoading(false);
    }
  }

  const onFocusIsAr = async () => {
    if(!isArs?.length || isArs?.length === 1){
      setIsArs([
        { valueNum: -1, valueStr1: t('customer.all_ar') },
        { valueNum: 'Y', valueStr1: 'Авлагатай' },
        { valueNum: 'N', valueStr1: 'Авлагагүй' },
      ]); 
    }
  }

  const onChangeBranch = value => {
    setBranch(value);
    let data1 = [...[{subBranchCode: -1, subBranchName: t('customer.all_district')}], ...allBranches?.filter(item => item?.branchCode?.includes(value))];
    setSubBranches(data1);
    setSubBranch(-1);
    onHide(value, -1, isAr, search);
  }

  const onChangeSubBranch = value => {
    setSubBranch(value);
    onHide(branch, value, isAr, search);
  }

  const onChangeIsAr = value => {
    setIsAr(value);
    onHide(branch, subBranch, value, search);
  }

  const handleEnter = value => onHide(branch, subBranch, isAr, value);

  const onHide = (branch, subBranch, isAr, search) => {
    let query1 = [];
    if(branch !== -1) query1.push('BranchCode=' + branch);
    if(branch !== -1 && subBranch !== -1) query1.push('SubBranchCode=' + subBranch);
    if(isAr !== -1) query1.push('IsAr=' + isAr);
    if(search) query1.push('CustName=' + search);
    let query2 = query1.join('&');
    let query = query2 ? ('?' + query2) : '';
    getData(query);
  }

  const id = pgWidth > 1090 ? 'ih_large' : 'ih_small';
  const addProps = { show, onClickAdd, onClickDelete };
  const selectProps = { classBack: 'cou_select_back1', classLabel: 'ih_select_lbl', className: 'filter_select', bStyle: { width: width?.picker } };

  return (
    <div id={id} style={{position: 'relative'}}>
      <div className='ih_header1'>
        <ButtonRowAdd type='customer' {...addProps} />
        {!show && <Button className='ih_btn' text={t('page.import')} onClick={onClickImport} />}
        {!show && <ExportExcel text={t('page.export')} excelData={data} columns={columns} excelName={t('header./customer')} />}
      </div>
      <div className="filter_wrap">
        <Search1 search={search} setSearch={setSearch} handleEnter={handleEnter} width={width?.search} />
        <PlainSelect {...selectProps} s_value='branchCode' s_descr='branchName' loading={loading}
          value={branch}
          setValue={onChangeBranch}
          data={branches} />
        <PlainSelect {...selectProps} s_value='subBranchCode' s_descr='subBranchName'
          value={subBranch}
          setValue={onChangeSubBranch}
          data={subBranches}
          onFocus={onFocusBranch} />
        <PlainSelect {...selectProps} s_value='valueNum' s_descr='valueStr1'
          value={isAr}
          setValue={onChangeIsAr}
          data={isArs}
          onFocus={onFocusIsAr} />
      </div>
    </div>
  );
}