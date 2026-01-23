import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useMeasure from 'react-use-measure';

import '../../css/customer.css';
import { getList, getServiceBar, sendRequest } from "../../services";
import { Empty2, Error1, Help, Overlay, Subscription } from "../../components/all";
import { CustomerAdd, CustomerFilter, CustomerList } from "../../components/customer/list";
import moment from "moment";

export function Customer(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [error, setError] = useState(null);
  const [branch, setBranch] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [filter, setFilter] = useState('');
  const [filtering, setFiltering] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [ref, bounds] = useMeasure();
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pgWidth = bounds?.width;

  useEffect(() => {
    user?.msRole?.webManageCustomer !== 'Y' ? navigate({ pathname: '/' }) : onMount();
    return () => {};
  }, []);

  const onMount = async () => {
    let response = await getBranches();
    getData(null, response);
  }

  const getBranches = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getServiceBar('getBranchInfo'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return null;
    } else {
      let data = [];
      response?.data?.data?.forEach(item => {
        let index = data?.findIndex(list => item.branchCode === list.branchCode);
        if(index === -1) data.push(item)
      });
      let branch = data?.sort((a, b) => a?.branchCode - b?.branchCode);
      setBranch(branch);
      setAllBranch(response?.data?.data);
      return { data1: branch, data2: response?.data?.data }
    }
  }

  const getData = async (query, branches) => {
    setFilter(query);
    setError(null);
    setLoading(true);
    setRowSelection({});
    let response = query
      ? await dispatch(getList(user, token, 'Site/GetCustomer/Filter' + query))
      : await dispatch(getList(user, token, 'Site/GetCustomer', null, { CustID: -1 }));
    if(response?.code === 1000) setVisible1(true);
    if(response?.error) setError(response?.error);
    else {
      let data = response?.data?.customers ?? response?.data;
      data?.forEach(item => {
        let data1 = branches?.data1 ?? branch;
        item.branchName = data1?.filter(f => f.branchCode === item?.branchCode)[0]?.branchName ?? '';
        let data2 = branches?.data2 ?? allBranch;
        item.subBranchName = data2?.filter(f => f.branchCode === item?.branchCode && f.subBranchCode === item?.subBranchCode)[0]?.subBranchName ?? '';
        item.lastSalesDate = item?.lastSalesDate ? moment(item?.lastSalesDate).format('YYYY.MM.DD') : '';
        item.datediff = item?.lastSalesDate ? -(moment(item?.lastSalesDate).diff(moment(), 'days')) : 0
      });
      setData(data?.filter(d => d.status === 1));
    }
    setLoading(false);
    setFiltering(query ? true : false);
    setShow(false);
  }

  const onClickAdd = row => {
    setVisible(true);
    setSelected(row?.original);
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => {
      if(rowSelection && rowSelection[item?.custId]){
        item.rowStatus = 'D';
        toDelete.push(item);
      }
    });
    setLoading(true);
    setError(null);
    let response = await dispatch(sendRequest(user, token, 'Site/Customer', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      toast.success(t('customer.delete_success'));
      getData(filter);
    }
  }

  const closeModal = toGet => {
    setVisible(false);
    setSelected(null);
    if(toGet) getData(filter);
  }

  const onClickImport = () => navigate('/customer/customer_import');
  const onDone = async () => setVisible1(false);

  const filterProps = { pgWidth, show, data, columns, setError, onClickAdd, onClickDelete, onClickImport, getData };
  const listProps = { pgWidth, data, columns, setColumns, rowSelection, setRowSelection, setShow, onClickAdd, setError, onSearch: getData };
  const addProps = { visible, selected, branch, allBranch, closeModal };
  const noData = !data?.length && !filtering;
  const style = noData ? { display: 'none' } : null;

  return (
    <div className='page_container' style={{ maxWidth }}>
      {visible1 && <Subscription visible={visible1} setVisible={setVisible1} onDone={onDone} />}
      {visible && <CustomerAdd {...addProps} />}
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {noData && <Empty2 icon='MdSupervisorAccount' type='customer' noDescr={true} onClickAdd={onClickAdd} onClickImport={onClickImport} />}
        <div ref={ref} className='page_back'style={style}>
          <CustomerFilter {...filterProps} />
          <CustomerList {...listProps} />
        </div>
      </Overlay>
      <Help videoData={[{id: "v_Up6Wi08PQ"}]}/>
    </div>
  );
}