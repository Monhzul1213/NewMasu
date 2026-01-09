import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import mime from 'mime';

import '../../css/invt.css';
import { toHours, urlToFile } from "../../helpers";
import { deleteRequest, getList, sendRequest } from "../../services";
import { ButtonRowConfirm, CardEmpty, Error1, Overlay, Prompt } from "../../components/all";
import { InventoryCardKit, InventoryCardMain, InventoryCardModifer, InventoryCardSite, InventoryCardVariant } from "../../components/inventory/inventory/add";
import { Modal } from "antd";

export function InventoryAdd(props){
  const { visible, selected, closeModal} = props;
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [edited, setEdited] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState({ value: '' });
  const [category, setCategory] = useState({ value: -1 });
  const [isEach, setIsEach] = useState({ value: 'Y' });
  const [isUseTime, setIsUseTime] = useState(false);
  const [batch, setBatch] = useState({ value: '' });
  const [isService, setIsService] = useState(false);
  const [time, setTime] = useState({ value: '01:00' });
  const [image, setImage] = useState(null);
  const [image64, setImage64] = useState('');
  const [imageType, setImageType] = useState('');
  const [descr, setDescr] = useState({ value: '' });
  const [price, setPrice] = useState({ value: '' });
  const [cost, setCost] = useState({ value: '' });
  const [sku, setSku] = useState({ value: '' });
  const [barcode, setBarcode] = useState({ value: '' });
  const [buyAgeLimit, setBuyAgeLimit] = useState({ value: 0 });
  const [vendId, setVendId] = useState({ value: null });
  const [sites, setSites] = useState([]);
  const [isKit, setIsKit] = useState(false);
  const [searchI, setSearchI] = useState({ value: null });
  const [totalI, setTotalI] = useState(0);
  const [kits, setKits] = useState([]);
  const [dkits, setDKits] = useState([]);
  const [variants, setVariants] = useState([]);
  const [dvariants, setDVariants] = useState([]);
  const [searchV, setSearchV] = useState({ value: '' });
  const [disabledV, setDisabledV] = useState(false);
  const [modifiers, setModifiers] = useState([]);
  const [checked, setChecked] = useState(true);
  const [invt, setInvt] = useState(null);
  const [searchParams] = useSearchParams();
  const { user, token } = useSelector(state => state.login);
  const maxWidth = useSelector(state => state.temp.maxWidth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    user?.msRole?.webManageItem !== 'Y' ? navigate({ pathname: '/' }) : getData();
    return () => setEdited(false);
  }, []);

  useEffect(() => {
    if(saved) onClickCancel();
    return () => {};
  }, [saved]);

  const getData = async () => {
    setLoaded(true);
    let invtId = selected?.invtId, response1 = false;
    let response = await getSites();
    if(response) response1 = await getModifiers();
    if(response1 && (invtId || invtId === 0)) await getInventory(invtId, response, response1);
    else {
      setSites(response);
      setModifiers(response1);
      let vendor = searchParams?.get('vendId');
      if(vendor) setVendId({ value: parseInt(vendor) });
    }
    setLoaded(false);
  }

  const getSites = async () => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Site/GetSite'));
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.map(item => item.checked = true);
      return response?.data;
    }
  }

  const getModifiers = async () => {
    setError(null);
    const response = await dispatch(getList(user, token, 'Inventory/GetModifer'));
    if(response?.error){
      setError(response?.error);
      return false;
    } else {
      response?.data?.forEach(item => {
        if(item?.modifer?.useAllSite === 'Y') item.modifer.options = t('inventory.modifer_all');
        else {
          let options = item?.modiferSites?.map(mod => mod.siteName);
          item.modifer.options = options?.join(', ');
        }
      });
      return response?.data;
    }
  }

  const getInventory = async (value, sites1, modifiers1) => {
    setError(null);
    let data = [{ fieldName: 'InvtID', value }];
    let response = await dispatch(sendRequest(user, token, 'Inventory/GetInventory/Custom', data));
    let invt = response && response?.data && response?.data[0];
    if(response?.error) setError(response?.error);
    else if(invt) {
      setInvt(invt);
      setBatch({ value: invt?.msInventory?.batchQty ?? '' });
      setName({ value: invt?.msInventory?.name ?? '' });
      setCategory({ value: invt?.msInventory?.categoryId ?? -1 });
      setBuyAgeLimit({ value: invt?.msInventory?.buyAgeLimit ?? 0 });
      if(invt?.msInventory?.vendID !== -1) setVendId({ value: invt?.msInventory?.vendID });
      setIsEach({ value: invt?.msInventory?.isEach ?? 'Y' });
      setIsService(invt?.msInventory?.isService === 'Y');
      setIsUseTime(invt?.msInventory?.isServiceUseTime === 'Y');
      setTime(toHours(invt?.msInventory?.serviceTime));
      setDescr({ value: invt?.msInventory?.descr ?? '' });
      setPrice({ value: invt?.msInventory?.price ?? 0 });
      setCost({ value: invt?.msInventory?.cost ?? 0 });
      setSku({ value: invt?.msInventory?.sku ?? '' });
      setBarcode({ value: invt?.msInventory?.barCode ?? '' });
      setIsKit(invt?.msInventory?.isKit === 'Y');
      if(invt?.msInventory?.isKit === 'Y'){
        invt?.msInvKitItems?.forEach(kit => kit.unitCost = kit.cost / kit.qty);
        setKits(invt?.msInvKitItems);
        setTotalI(invt?.msInventory?.cost ?? 0);
      } else
        setVariants(invt?.msInventoryVariants);
      setChecked(invt?.msInventory?.useAllSite === 'Y');
      sites1?.forEach(item => {
        let exists = invt?.psSalesPrices?.filter(si => si.siteId === item.siteId)[0];
        item.checked = exists ? true : false;
        if(exists){
          item.price = exists.price;
          item.useNhat = exists.useNhat;
          item.useSalesPrice = exists.useSalesPrice;
          item.salesPrice = exists.salesPrice;
          item.salesBeginDate = exists.salesBeginDate;
          item.salesEndDate = exists.salesEndDate;
          item.salesTimeLimited = exists.salesTimeLimited;
          item.salesBeginTime = exists.salesBeginTime;
          item.salesEndTime = exists.salesEndTime;
          if(exists.useSalesPrice === 'Y'){
            let salesLabel = moment(exists.salesBeginDate).format('MM.DD')
              + '-' + moment(exists.salesEndDate).format('MM.DD');
            if(exists.salesTimeLimited === 'Y') salesLabel += ' ' + exists.salesBeginTime?.slice(0, 5) + '-' + exists.salesEndTime?.slice(0, 5);
            item.salesLabel = ' (' + salesLabel + ')';
          }
          item.useWholePrice = exists.useWholePrice;
          item.wholePrice = exists.wholePrice;
          item.wholeQty = exists.wholeQty;
          item.useMinQty = exists.useMinQty;
          item.minQty = exists.minQty;
        }
        item.rowStatus = exists ? 'U' : 'I';
      });
      setSites(sites1);
      modifiers1.forEach(item => {
        let exists = invt?.msInventoryModifers?.filter(si => si.modifireId === item?.modifer?.modifireID)[0];
        item.checked = exists?.useModifier === 'Y';
        item.rowStatus = exists ? 'U' : 'I';
      });
      setModifiers(modifiers1);
      getImage(invt?.msInventory);
    }
  }

  const getImage = async inventory => {
    if(inventory?.fileRaw?.fileData){
      let type = inventory?.fileRaw?.fileType?.replace('.', '');
      setImageType(type ?? '');
      let mimeType = mime.getType(type);
      let dataPrefix = `data:` + mimeType + `;base64,`;
      let attach64 = `${dataPrefix}${inventory?.fileRaw?.fileData}`;
      let attachFile = await urlToFile(attach64, mimeType);
      setImage64(attach64);
      setImage(attachFile);
    }
  }

  const onClickCancel = () => navigate('/inventory/invt_list');

  const validateData = () => {
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    let invkite = [], invvar = [], invmod = [], invsales = [];
    let [hours, minutes] = time?.value?.replace(/-/g, '0').split(':');
    let totalSeconds = (+hours) * 60 + (+minutes) ;
    if(isNameValid && barcode?.value){
      if(isKit){
        if(kits?.length){
          kits?.forEach(item => {
            invkite.push({
              invtID: item?.invtId, qty: parseFloat(item?.qty ? item?.qty : 0), cost: parseFloat(item?.cost ? item?.cost : 0),
              rowStatus: item?.kitId || item?.kitId === 0 ? 'U' : 'I'
            });
          });
          dkits?.forEach(it => invkite?.push({...it, rowStatus: 'D'}));
        } else {
          setSearchI({ value: searchI?.value, error: t('inventory.kit_error') });
          return false;
        }
      } else {
        if(disabledV){
          setSearchV({ value: searchV?.value, error: t('inventory.variant_error1') });
          return false;
        } else {
          variants?.forEach(item => {
            let varItem = { variantName: item?.variantName, barCode: item?.barCode?.trim(), sku: item?.sku?.trim(),
              price: parseFloat(item?.price ? item?.price : 0), cost: parseFloat(item?.cost ? item?.cost : 0) };
            if(invt){
              varItem.variantID = item?.variantId ?? -1;
              varItem.rowStatus = item?.variantId || item?.variantId === 0 ? 'U' : 'I';
            }
            invvar.push(varItem);
          });
          dvariants?.forEach(it => invvar?.push({...it, rowStatus: 'D'}));
        }
      }
      modifiers?.forEach(item => {
        if(item?.checked) invmod.push({ modifireID: item?.modifer?.modifireID, useModifier: 'Y', rowStatus: item?.rowStatus ?? 'I' });
        else if(item?.rowStatus === 'U') invmod.push({ modifireID: item?.modifer?.modifireID, useModifier: 'N', rowStatus: 'D' });
      });
      sites?.forEach(item => {
        let newItem = {
          siteID: item?.siteId, price: parseFloat(item?.price ? item?.price : 0),
          useSalesPrice: item?.useSalesPrice ?? 'N', salesPrice: parseFloat(item?.salesPrice ? item?.salesPrice : 0),
          salesBeginDate: item?.salesBeginDate, salesEndDate: item?.salesEndDate, 
          salesTimeLimited: item?.salesTimeLimited ?? 'N', salesBeginTime: item?.salesBeginTime, salesEndTime: item?.salesEndTime,
          useWholePrice: item?.useWholePrice ?? 'N', wholeQty: parseFloat(item?.wholeQty ? item?.wholeQty : 0),
          wholePrice: parseFloat(item?.wholePrice ? item?.wholePrice : 0),
          useMinQty: item?.useMinQty ?? 'N', minQty: parseFloat(item?.minQty ? item?.minQty : 0),
          status: 0, useNhat: item?.useNhat ?? 'N'
        };
        if(item?.checked) invsales.push({...newItem, rowStatus: item?.rowStatus ?? 'I' });
        else if(item?.rowStatus === 'U') invsales.push({...newItem, rowStatus: 'D' });
      });
      let data = {
        name: name?.value, categoryID: category?.value, descr: descr?.value, isEach: isEach?.value,
        buyAgeLimit: buyAgeLimit?.value,
        vendID: vendId?.value ?? -1, vendInvtID: invt?.vendInvtID ?? '', vendUnitID: invt?.vendUnitID ?? '',
        price: parseFloat(price?.value ? price?.value : 0),
        cost: parseFloat(cost?.value ? cost?.value : 0),
        sku: sku?.value, barCode: barcode?.value, isKit: isKit ? 'Y' : 'N', isTrackStock: 'N',
        UseAllSite: checked ? 'Y' : 'N',
        image: { FileData: image64 ?? '', FileType: imageType ?? '' },
        isService: isService ? 'Y' : 'N', serviceTime: totalSeconds,
        rowStatus: invt ? 'U' : 'I', batchQty: batch?.value, isServiceUseTime: isUseTime ? 'Y' : 'N',
        invkite, invvar, invmod, invsales
      };
      if(invt){
        data.invtID = invt?.msInventory?.invtId;
        data.useAllSite = checked ? 'Y' : 'N';
      }
      return data;
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!barcode?.value) setBarcode({ value: '', error: t('error.not_empty') });
      return false;
    }
  }

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
    closeModal(true);
  }

  const onClickSave = async () => {
    let data = validateData();
    if(data){
      onLoad();
      let api = invt ? 'Inventory/UpdateInventory' : 'Inventory/AddInventory';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) onError(response?.error);
      else onSuccess(t('inventory.add_success'));
    }
  }

  const onClickDelete = async () => {
    onLoad();
    const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteInventory/' + invt?.msInventory?.invtId));
    if(response?.error) onError(response?.error);
    else onSuccess(t('inventory.delete_success'));
  }

  const mainProps = { setError, setEdited, name, setName, category, setCategory, isEach, setIsEach, isUseTime, setIsUseTime, batch, setBatch, isService, setIsService,
    time, setTime, image, setImage, setImage64, setImageType, descr, setDescr, price, setPrice, cost, setCost, sku, setSku, barcode, setBarcode, setSites,
    buyAgeLimit, setBuyAgeLimit, vendId, setVendId, setIsKit, setLoading };
  const invtProps = { isKit, setIsKit, isUseTime, setCost, search: searchI, setSearch: setSearchI, total: totalI, setTotal: setTotalI, data: kits, setData: setKits,
    setEdited, setDKits };
  const variantProps = { data: variants, setData: setVariants, search: searchV, setSearch: setSearchV, isUseTime, setEdited, price, cost, disabled: disabledV,
    setDisabled: setDisabledV, setDVariants };
  const siteProps = { checked, setChecked, setEdited, data: sites, setData: setSites };
  const siteEmptyProps = { title: 'inventory.sites', icon: 'MdStorefront', btn: 'inventory.shop_add', route: '/config/store', disabled: true };
  const modiProps = { data: modifiers, setData: setModifiers, setEdited };
  const modiEmptyProps = { title: 'inventory.modifier', icon: 'MdStorefront', route: '/inventory/invt_modi', btn: 'modifier.add', disabled: true  };
  const btnProps = { onClickCancel: closeModal, onClickSave, onClickDelete, type: 'submit', show: invt ? true : false };

  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={870}>
      <div className='page_container' style={{ maxWidth, padding: '15px 5px' }}>
        <Overlay loading={loading || loaded}>
          {error && <Error1 error={error} />}
          <Prompt edited={edited} />
          <div className='i_scroll1' id="y_scroll">
            <form>
              <InventoryCardMain {...mainProps} />
              <div className='gap' />
              <InventoryCardKit {...invtProps} />
              <div className='gap' />
              {!isKit && <InventoryCardVariant {...variantProps} />}
              {!isKit && <div className='gap' />}
              {sites?.length ? <InventoryCardSite {...siteProps} /> : <CardEmpty {...siteEmptyProps} />}
              <div className='gap' />
              {modifiers?.length ? <InventoryCardModifer {...modiProps} /> : <CardEmpty {...modiEmptyProps} />}
            </form>
          </div>
          <ButtonRowConfirm {...btnProps} id='add_bottom_row' />
        </Overlay>
      </div>
    </Modal>
  );
}