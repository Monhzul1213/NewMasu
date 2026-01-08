import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createSearchParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useMeasure from "react-use-measure";

import '../../css/invt.css';
import { Empty2, Error1, Help, Overlay } from "../../components/all";
import { deleteMultiRequest, getList, sendRequest } from "../../services";
import { InventoryFilter, InventoryList } from "../../components/inventory/inventory/list";

export function Inventory(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filtering, setFiltering] = useState(false);
  const [pageInfo, setPageInfo] = useState({ pageNumber: 1, pageSize: 1000, totalPage: 1 });
  const [categories, setCategories] = useState([{ categoryId: -1, categoryName: t('inventory.no_category') }]);
  const [vendors, setVendors] = useState([]);
  const [show, setShow] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [filter, setFilter] = useState([]);
  const [ref, bounds] = useMeasure();
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pgWidth = bounds?.width;

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
  }, []);

  const getData = async () => {
    let response1 = await getVendors();
    let response = await getCategories();
    if(response1 && response) await getInventory(pageInfo);
  }

  const getCategories = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...(response?.data ?? [])];
      setCategories(data);
      return true;
    }
  }

    const getVendors = async () => {
        setError(null);
        const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
        if(response?.error){
        setError(response?.error);
        return false;
        } else {
        setVendors(response?.data);
        return true;
        }
    }
  
  const getInventory = async (info, isEdit) => {
    setError(null);
    setLoading(true);
    let api = 'Inventory/GetInventory?PageNumber=' + info?.pageNumber + '&PageSize=' + info?.pageSize;
    const response = await dispatch(getList(user, token, api));
    setInventory(response, response?.data?.inventoryies, response?.data?.pageInfo, isEdit);
    setFiltering(false);
  }

  const onSearch = async (filter, isEdit) => {
    setFilter(filter);
    if(filter?.length){
      setError(null);
      setLoading(true);
      let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
      setInventory(response, response?.data, null, isEdit);
      setFiltering(true);
      setPageInfo({ pageNumber: 1, pageSize: 1000, totalPage: 1 });
    } else 
      getInventory(pageInfo, isEdit);
  }

  const setInventory = (response, list, info, isEdit) => {
    if(response?.error) setError(response?.error);
    else {
      list?.forEach(item => {
        let margin = +((item.msInventory.price - item.msInventory.cost) / (item.msInventory.price ? item.msInventory.price : 1) * 100).toFixed(2);
        item.msInventory.margin = (isNaN(margin) ? 0 : margin) + '%';
        item?.msInventoryVariants?.forEach(vart => {
          let margin = +((vart.price - vart.cost) / (vart.price ? vart.price : 1) * 100).toFixed(2);
          vart.margin = (isNaN(margin) ? 0 : margin) + '%';
        });
      });
      setData(list);
      if(info) setPageInfo(info);
      const scroll = document.getElementById('paging');
      if(scroll && !isEdit) scroll.scrollTop = 0;
    }
    setLoading(false);
    setShow(false);
    setRowSelection({});
  }

  const onClickImport = () => navigate('invt_import');
  const onClickAdd = row => {
    if(row) navigate({ pathname: 'invt_add', search: createSearchParams({ invtId: row?.original?.msInventory?.invtId }).toString() });
    else navigate({ pathname: 'invt_add' });
  }

  const onClickDelete = async () => {
    let toDelete = [];
    data?.forEach(item => { if(rowSelection && rowSelection[item?.msInventory?.invtId]) toDelete.push({ invtID: item?.msInventory?.invtId }); });
    setError(null);
    setLoading(true);
    let response = await dispatch(deleteMultiRequest(user, token, 'Inventory/DcInventory', toDelete));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      toast.success(t('inventory.delete_success'));
      onSearch(filter);
    }
  }

  const updateInventory = async (data, isEdit, isExpand) => {
    if(!isEdit) setLoading(true);
    setError(null);
    const response = await dispatch(sendRequest(user, token, 'Inventory/UInvCustom', data));
    setLoading(false);
    if(!response?.error){
      toast.success(t('inventory.add_success'));
      onSearch(filter, isEdit || isExpand);
    } else if(response?.error && !isEdit) setError(response?.error);
    return response;
  }

  const filterProps = { pgWidth, show, columns, data, onClickAdd, onClickDelete, onClickImport, onSearch, setError };
  const listProps = { pgWidth, data, columns, setColumns, rowSelection, setRowSelection, setShow, updateInventory, categories, onClickAdd, filtering,
    pageInfo, getInventory, vendors };
  const noData = !data?.length && !filtering;
  const style = noData ? { display: 'none' } : null;

  return (
    <div className='page_container' style={{ maxWidth }}>
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {noData && <Empty2 icon='MdOutlineShoppingBasket' type='inventory' onClickAdd={onClickAdd} onClickImport={onClickImport} />}
        <div ref={ref} className='page_back1' style={style}>
          <InventoryFilter {...filterProps} cats={categories} vendors={vendors}/>
          <InventoryList {...listProps} />
        </div>
      </Overlay>
      <Help videoData={[{id: "8IMwbPxh-QQ"}]}/>
    </div>
  );
}
// import React, { useState, useEffect } from 'react';
// // import { SizeMe } from 'react-sizeme';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
// import { message } from 'antd';

// import '../../css/invt.css';
// import { deleteMultiRequest, getList, sendRequest } from '../../services';
// import { Confirm, Empty2, Error1, Overlay } from '../../components/all';
// // import { Help, List } from '../../components/invt/inventory/list';
// // import { InventoryAdd } from './InventoryAdd';

// export function Inventory(){
//   const { t } = useTranslation();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);
//   const [show, setShow] = useState(false);
//   const [checked, setChecked] = useState(false);
//   const [filtering, setFiltering] = useState(false);
//   const [categories, setCategories] = useState([{categoryId: -1, categoryName: t('inventory.no_category')}]);
//   const [vendors, setVendors] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [pageInfo, setPageInfo] = useState({ pageNumber: 1, pageSize: 1000, totalPage: 1 });
//   const [filter, setFilter] = useState([]);
//   const [excelName, setExcelName] = useState('');
//   const [autoResetExpanded, setAutoResetExpanded] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const { user, token }  = useSelector(state => state.login);
//   const maxWidth = useSelector(state => state.temp.maxWidth);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
//     return () => {};
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const getData = async () => {
//     let response1 = await getVendors();
//     let response = await getCategories();
//     if(response1 && response) await getInventory(pageInfo);
//   }

//   const getCategories = async () => {
//     setError(null);
//     setLoading(true);
//     const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
//     setLoading(false);
//     if(response?.error){
//       setError(response?.error);
//       return false;
//     } else {
//       let data = [...[{categoryId: -1, categoryName: t('inventory.no_category')}], ...response?.data];
//       setCategories(data);
//       return true;
//     }
//   }

//   const getVendors = async () => {
//     setError(null);
//     const response = await dispatch(getList(user, token, 'Merchant/vendor/getvendor'));
//     if(response?.error){
//       setError(response?.error);
//       return false;
//     } else {
//       setVendors(response?.data);
//       return true;
//     }
//   }

//   const setInventory = (response, list, info) => {
//     if(response?.error) setError(response?.error);
//     else {
//       const sortedList = [...list].sort(
//         (a, b) =>
//           (a?.msInventory?.viewPriority ?? 0) -
//           (b?.msInventory?.viewPriority ?? 0)
//       );
//       sortedList?.forEach(item => {
//         let margin = +((item.msInventory.price - item.msInventory.cost) / (item.msInventory.price ? item.msInventory.price : 1) * 100).toFixed(2);
//         item.msInventory.margin = (isNaN(margin) ? 0 : margin) + '%';
//         item?.msInventoryVariants?.forEach(vart => {
//           let margin = +((vart.price - vart.cost) / (vart.price ? vart.price : 1) * 100).toFixed(2);
//           vart.margin = (isNaN(margin) ? 0 : margin) + '%';
//         });
//         if(item.msInventory.vendId === -1){
//           item.msInventory.vendId = null;
//         }
//       });
//       setData(sortedList);
//       if(info) setPageInfo(info);
//       const scroll = document.getElementById('paging');
//       if(scroll) scroll.scrollTop = 0;
//     }
//     setLoading(false);
//     setShow(false);
//     setChecked(false);
//   }

//   const getInventory = async (info, isEdit) => {
//     setError(null);
//     setLoading(true);
//     setAutoResetExpanded(isEdit ? false : true);
//     let api = 'Inventory/GetInventory?PageNumber=' + info?.pageNumber + '&PageSize=' + info?.pageSize;
//     const response = await dispatch(getList(user, token, api));
//     setInventory(response, response?.data?.inventoryies, response?.data?.pageInfo);
//     setFiltering(false);
//     setExcelName(t('header./inventory'))
//   }

//   const onSearch = async (filter, isEdit) => {
//     if(filter?.length){
//       setFilter(filter);
//       setError(null);
//       setLoading(true);
//       setAutoResetExpanded(isEdit ? false : true);
//       let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', filter))
//       response?.data?.forEach(item =>{
//         item.msInventory.vendId = item.msInventory.vendID;
//       })
//       setInventory(response, response?.data);
//       setFiltering(true);
//       setPageInfo({ pageNumber: 1, pageSize: 1000, totalPage: 1 });
//     } else 
//       getInventory(pageInfo, isEdit);
//   }

//   // const onClickAdd = row => {
//   //   if(row) navigate({ pathname: 'invt_add', search: createSearchParams({ invtId: row?.invtId }).toString() });
//   //   else navigate({ pathname: 'invt_add' });
//   // }

//   const onClickAdd = row => {
//     setVisible(true);
//     setSelected(row);
//   }

//   const closeModal = toGet => {
//     setVisible(false);
//     setSelected(null);
//     if(toGet === true) getData();
//   }

//   const confirm = async sure => {
//     setOpen(false);
//     if(sure){
//       let toDelete = [];
//       data?.forEach(item => {
//         if(item.checked) toDelete.push({ invtID: item?.msInventory?.invtId });
//       });
//       setError(null);
//       setLoading(true);
//       let response = await dispatch(deleteMultiRequest(user, token, 'Inventory/DcInventory', toDelete));
//       setLoading(false);
//       if(response?.error) setError(response?.error);
//       else {
//         message.success(t('inventory.delete_success'));
//         onSearch(filter);
//       }
//     }
//   }

//   const updateInventory = async (data, isEdit, isExpand) => {
//     if(!isEdit) setLoading(true);
//     setError(null);
//     const response = await dispatch(sendRequest(user, token, 'Inventory/UInvCustom', data));
//     setLoading(false);
//     if(!response?.error){
//       message.success(t('inventory.add_success'));
//       onSearch(filter, isEdit || isExpand);
//     } else if(response?.error && !isEdit) setError(response?.error);
//     return response;
//   }

//   const onClickDelete = () => setOpen(true);
 
//   const onClickImport = () => navigate('invt_import');

//   const emptyProps = { icon: 'MdOutlineShoppingBasket', type: 'inventory', onClickAdd, onClickImport };
//   const listProps = { data, setData, categories, onClickAdd, setShow, checked, setChecked, updateInventory,
//     autoResetExpanded, filtering, onClickDelete, show, setError, onSearch, cats: categories, excelName, pageInfo, getInventory, vendors};
//   const confirmProps = { open, text: t('page.delete_confirm'), confirm };
//   const videoData = [{id: "8IMwbPxh-QQ"}]
//   const modalProps = { visible, closeModal, selected };

//   return (
//     <div className='s_container_i' style={{maxWidth}}>
//       {/* {open && <Confirm {...confirmProps} />} */}
//       {/* {visible && <InventoryAdd {...modalProps} />} */}
//       <Overlay loading={loading}>
//         {error && <Error1 error={error} />}
//         {/* {!data?.length && !filtering ? <Empty2 {...emptyProps} /> :
//           <SizeMe>{({ size }) => 
//             <div className='i_list_cont' id='invt_list'>
//               {<List {...listProps} size={size} />}
//             </div>
//           }</SizeMe>
//         } */}
//       </Overlay>
//       {/* <Help videoData={videoData}/> */}
//     </div>
//   )
// }