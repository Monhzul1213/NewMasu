import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getList, sendRequest } from '../../services';
import { ButtonRowConfirm, CardEmpty, Confirm, Error1, Memo, Overlay, Prompt } from '../../components/all';
import { ModifierCardOption, ModifierCardSite } from '../../components/inventory/modifier';

export function ModifierAdd(){
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [items, setItems] = useState([]);
  const [dItems, setDItems] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [sites, setSites] = useState([]);
  const [edited, setEdited] = useState(false);
  const [item, setItem] = useState(null);
  const [search, setSearch] = useState({ value: '' });
  const [checked, setChecked] = useState(true);
  const [saved, setSaved] = useState(false);
  const [searchParams] = useSearchParams();
  const { user, token }  = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => {};
  }, []);
  
  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
  }, [saved]);

  const getData = async () => {
    let modifireID = searchParams?.get('modifireID');
    let response = await getSites();
    if(response && (modifireID || modifireID === 0)) await getModifier(modifireID, response);
  }

  const getModifier = async (modifireid, siteRes) => {
    setError(null);
    setLoading(true);
    let response = await dispatch(getList(user, token, 'Inventory/GetModifer/ModifireID', null, { modifireid }));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      setItem(response?.data);
      setName({ value: response?.data?.modifer?.modiferName ?? '' });
      response?.data?.modiferItems?.forEach(item => item.rowStatus = 'U');
      setItems(response?.data?.modiferItems);
      siteRes?.forEach(item => {
        let exists = response?.data?.modiferSites?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists?.useModifier === 'Y';
        if(exists) item.rowStatus = 'U';
      });
      setSites(siteRes);
      setChecked(response?.data?.modifer?.useAllSite === 'Y');
    }
  }

  const getSites = async () => {
    setError(null);
    setLoading(false);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    setLoading(false);
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        item.checked = true;
        item.rowStatus = 'I';
      });
      setSites(response?.data);
      return response?.data;
    }
  }

  const onClickCancel = () => navigate('/modifier');

  const onLoad = () => {
    setError(null);
    setLoading(true);
    setEdited(false);
  }

  const onError = err => {
    setError(err);
    setEdited(true);
    setLoading(false);
  }

  const onSuccess = msg => {
    toast.success(msg);
    setSaved(true);
    setLoading(false);
  }

  const onClickSave = async () => {
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && items?.length && !disabled){
      onLoad();
      let modifer = { modifireID: item?.modifer?.modifireID ?? -1, modiferName: name?.value,
        rowStatus: item ? 'U' : 'I', UseAllSite: checked ? 'Y' : 'N', useAllSite: checked ? 'Y' : 'N' };
      let modiferItems = [], modiferSites = [];
      items?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0)}));
      dItems?.forEach(it => modiferItems?.push({...it, price: parseFloat(it?.price ? it?.price : 0), rowStatus: 'D'}));
      sites?.forEach(si => {
        if(si?.checked) modiferSites?.push({ siteId: si?.siteId, useModifier: 'Y', rowStatus: si?.rowStatus ?? 'I' });
        else if(si?.rowStatus === 'U') modiferSites?.push({ siteId: si?.siteId, useModifier: 'N', rowStatus: 'D' });
      });
      let data = [{ modifer, modiferItems, modiferSites }];
      let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('modifier.add_success'));
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!items?.length) setSearch({ value: search?.value, error: t('modifier.option_error1')});
      else if(disabled) setSearch({ value: search?.value, error: t('modifier.option_error2')});
    }
  }

  const onClickDelete = async () => {
    onLoad();
    item.modifer.rowStatus = 'D';
    item.modiferSites.forEach(sit => sit.rowStatus = 'U');
    let response = await dispatch(sendRequest(user, token, 'Inventory/Modifer', [item]));
    if(response?.error) onError(response?.error);
    else onSuccess(t('modifier.delete_success'))
  }
  
  const optionProps = { name, setName, setError, data: items, setData: setItems, setDItems, setEdited, disabled, setDisabled, search, setSearch };
  const siteProps = { data: sites, setData: setSites, setEdited, checked, setChecked, id: 'ma_back' };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', route: '/config/store', btn: 'shop.add', id: 'ma_back' };
  const btnProps = { onClickCancel, onClickSave, onClickDelete, type: 'submit', show: item ? true : false};

  return (
    <div className='page_container' style={{maxWidth}}>
      <Overlay loading={loading}>
        <Prompt edited={edited} />
        {error && <Error1 error={error} />}
        <div className='i_scroll'>
          <form>
            <ModifierCardOption {...optionProps} />
            <Memo text={t('inventory.variant_memo')} style={{maxWidth: 'var(--empty-width)'}}/>
            <div className='gap' />
            {sites?.length ? <ModifierCardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
          </form>
        </div>
        <ButtonRowConfirm {...btnProps} id='add_bottom_row_mod' />
      </Overlay>
    </div>
  )
}