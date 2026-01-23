import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import '../../css/invt.css';
import { deleteMultiRequest, getList } from "../../services";
import { Empty, Error1, Overlay } from "../../components/all";
import { CategoryAdd, CategoryList } from "../../components/inventory/category";

export function Category(){
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [item, setItem] = useState(null);
  const [show, setShow] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selected, setSelected] = useState({});
  const [useConfig, setUseConfig] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
  }, []);

  const getData = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(getList(user, token, 'Inventory/GetCategory'));
    if(response?.error) setError(response?.error);
    else setData(response?.data?.sort((a, b) => a.viewPriority - b.viewPriority));
    await getConfig();
    setLoading(false);
    setShow(false);
    setChecked(false);
    setSelected({});
  }

  const getConfig = async () => {
    const response = await dispatch(getList(user, token, 'Merchant/GetConfig'));
    setUseConfig(response?.data?.useKitchenPrinter === 'Y');
  }

  const onClickAdd = item => {
    setVisible(true);
    setItem(item);
  }

  const onClickDelete = async () => {
    setError(null);
    setLoading(true);
    let toDelete = [];
    (Object.keys(selected))?.map(item => toDelete?.push({ categoryID: parseInt(item) }));
    const response = await dispatch(deleteMultiRequest(user, token, 'Inventory/DcCategory', toDelete));
    if(response?.error) {
      setError(response?.error);
      setLoading(false);
    }
    else getData();
  }

  const closeModal = toGet => {
    setVisible(false);
    setItem(null);
    if(toGet) getData();
  }

  const listProps = { show, setShow, checked, setChecked, data, setData, selected, setSelected, onClickAdd, setLoading, onClickDelete };
  const addProps = { visible, closeModal, selected: item, useConfig };

  return (
    <div className='page_container' style={{ maxWidth }}>
      <CategoryAdd {...addProps} />
      <Overlay loading={loading}>
        {error && <Error1 error={error} />}
        {data?.length ? <CategoryList {...listProps} /> : <Empty icon='MdOutlineCategory' type='category' onClickAdd={onClickAdd} />}
      </Overlay>
    </div>
  );
}