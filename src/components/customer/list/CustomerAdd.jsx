import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { getList, sendRequest } from "../../../services";
import { cityList, validateEmail } from "../../../helpers";
import { DynamicBSIcon, Error, IconButton, Input, Coordinate, ModalTitle, Select, Location, Overlay, ButtonRow } from "../../all";
import { CustomerTypeAdd } from "./CustomerTypeAdd";

export function CustomerAdd(props){
  const { visible, selected, closeModal, branch, allBranch } = props;
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const [custName, setCustName] = useState({ value: '' });
  const [type, setType] = useState({ value: -1 });
  const [types, setTypes] = useState([{ customerTypeID: -1, typeName: t('customer.no_type') }]);
  const [typeVisible, setTypeVisible] = useState(false);
  const [phone, setPhone] = useState({ value: '' });
  const [email, setEmail] = useState({ value: '' });
  const [descr, setDescr] = useState({ value: null });
  const [descr1, setDescr1] = useState({ value: null });
  const [descr2, setDescr2] = useState({ value: null });
  const [city, setCity] = useState(null);
  const [subBranch, setSubBranch] = useState([]);
  const [subDescr, setSubDescr] = useState({ value: null });
  const [location, setLocation] = useState({ value: '' });
  const [mapVisible, setMapVisible] = useState(false);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState({ value: '' });
  const [custCode, setCustCode] = useState({ value: '' });
  const [note, setNote] = useState({ value: '' });
  const [loading, setLoading] = useState(false);
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    getTypes();
    return () => {};
  }, []);

  useEffect(() => {
    if(selected){
      setCustName({ value: selected?.custName ?? '' });
      setType({ value: selected?.customerTypeId ?? -1 });
      setPhone({ value: selected?.phone ?? '' });
      setEmail({ value: selected?.email ?? '' });
      setDescr({value: selected?.branchCode });
      setSubDescr({ value: selected?.subBranchCode });
      setSubBranch(allBranch?.filter(item => item?.branchCode?.includes(selected?.branchCode)));
      setLocation({ value: selected?.latitudes ? (selected?.latitudes + '\n' + selected?.longitudes) : ''})
      setLat(selected?.latitudes ? selected?.latitudes : 47.91452468522501);
      setLng(selected?.longitudes ? selected?.longitudes : 106.91007001230763);
      setAddress({ value: selected?.address ?? '' });
      setCustCode({ value: selected?.custCode ?? '' });
      setNote({ value: selected?.note ?? '' });
    }
    return () => {};
  }, []);

  const getTypes = async (toGet, id) => {
    if(!types?.length || types?.length === 1 || toGet){
      setError(null);
      const response = await dispatch(getList(user, token, 'Site/GetCustomerType'));
      if(response?.error) setError(response?.error);
      else {
        let data = [...[{customerTypeID: -1, typeName: t('customer.no_type')}], ...(response?.data?.msCustomerType ?? [])];
        setTypes(data);
        if(id) setType({ value: id });
      }
    }
  }

  const onClickCategory = e => {
    e?.preventDefault();
    setTypeVisible(true);
  }

  const closeCategory = (saved, id) => {
    setTypeVisible(false);
    if(saved) getTypes(saved, id);
  }

  const changePhone = value => {
    let text = value?.value?.replace(/[^0-9]/g, '');
    if(isNaN(text)) setPhone({ value: value?.value, error: 'must_number' });
    else setPhone({ value: text });
  } 

  const onChangeDescr = value => {
    setDescr(value);
    setSubBranch(allBranch?.filter(item => item?.branchCode?.includes(value?.value)));
    cityList?.forEach(item => {
      if(item?.districtCode?.includes(value?.value)){
        setDescr1({ value: item?.lan })
        setDescr2({ value: item?.lng })
        setCity(item?.city)
      }
    });
  }

  const onClickLocation = row => {
    if(!descr?.value) {
      setDescr({ value: null, error: t('error.select') });
      setMapVisible(false);
    } else
      setMapVisible(true);
  }

  const closeLocation = (hasLocation, y, x) => {
    setMapVisible(false);
    if(hasLocation){
      let coordinate = y + '\n' + x;
      setLocation({ value: coordinate });
      setLat(y);
      setLng(x);
      setError(null);
    }
  }

  const onClickDelete = async () => {
    setError(null);
    setLoading(true);
    let data = [{
      custID: selected?.custId,
      merchantID: user?.merchantId,
      custCode: selected?.custCode,
      custName: selected?.custName,
      email: selected?.email,
      phone: selected?.phone,
      address: selected?.address,
      city: "", region: "", postalCode: "", country: "",
      note: selected?.note,
      rowStatus : "D"
    }];
    const response = await dispatch(sendRequest(user, token, 'Site/Customer', data));
    if(response?.error) setError(response?.error);
    else {
      closeModal(true);
      toast.success(t('customer.delete_success'));
    }
    setLoading(false);
  }

  const checkValid = () => {
    let nameLength = 2, noteLength = 10, addressLength = 8;
    let isPhoneValid = phone?.value?.trim();
    let isEmailValid = !email?.value?.trim() || validateEmail(email?.value?.trim());
    let isNameValid = custName?.value?.length >= nameLength;
    let isNoteValid = !note?.value?.trim() || note?.value?.length >= noteLength;
    let isAddressValid = !address?.value?.trim() || address?.value?.length >= addressLength;
    if(isNameValid && isPhoneValid){
      return true;
    } else {
      if(!custName?.value?.trim()) setCustName({ value: '', error: t('error.not_empty') });
      if(!phone?.value?.trim()) setPhone({ value: '', error: t('error.not_empty') });
      if(!isNameValid) setCustName({ value: custName?.value, error: ' ' + nameLength + t('error.longer_than') });
      if(!isNoteValid) setNote({ value: note?.value, error: ' ' + noteLength + t('error.longer_than') });
      if(!isAddressValid) setAddress({ value: address?.value, error: ' ' + addressLength + t('error.longer_than') });
      if(!isEmailValid) setEmail({ value: email?.value?.trim(), error: t('error.be_right') });
      return false;
    }
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    if(checkValid()){
      setLoading(true);
      let data = [{
        custID: selected ? selected?.custId : -1,
        merchantID : user?.merchantId,
        custCode: custCode?.value?.trim(),
        custName: custName?.value?.trim(),
        email: email?.value?.trim(),
        phone: phone?.value?.trim(),
        address: address?.value?.trim(),
        city: "", region: "", postalCode: "", country: "",
        note: note?.value?.trim(),
        rowStatus : selected ? "U" : "I",
        branchCode: descr?.value,
        subBranchCode: subDescr?.value,
        latitudes: lat,
        longitudes: lng,
        customerTypeID: type?.value
      }];
      const response = await dispatch(sendRequest(user, token, 'Site/Customer',  data));
      setLoading(false);
      if(response?.error) setError(response?.error);
      else {
        let custId = response?.data && response?.data[0]?.custID;
        closeModal(true, custId);
        toast.success(t('customer.add_success'));
      }
    }
  }

  const mapProps = { mapVisible, closeLocation, lat, setLat, lng, setLng, city, descr1, descr2 };
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      {mapVisible && <Location {...mapProps} />}
      {typeVisible && <CustomerTypeAdd visible={typeVisible} closeModal={closeCategory} />}
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdSupervisorAccount' title={t(selected ? 'customer.edit' : 'customer.new')} isMD={true} />
            <div style={{ overflowY: 'scroll', maxHeight: 'calc(90vh - 105px)' }}>
            <form onSubmit={onClickSave}>
              <Input
                label={t('page.name')}
                value={custName}
                setValue={setCustName}
                placeholder={t('customer.name')}
                setError={setError}
                length={64} />
              <div className='end_row'>
                <div style={{flex: 1}}>
                  <Select
                    label={t('customer.t_type')}
                    value={type}
                    setValue={setType}
                    data={types}
                    setError={setError}
                    s_value='customerTypeID' s_descr='typeName'
                    onFocus={getTypes} />
                </div>
                <IconButton className='im_add_btn' onClick={onClickCategory} icon={<DynamicBSIcon name='BsPlusLg' className='im_add_btn_icon' />} />
              </div>
              <Input
                label={t('customer.phone1')}
                placeholder={t('customer.phone')}
                value={phone}
                setValue={changePhone}
                setError={setError}
                length={8} />
              <Input
                label={t('login.email')}
                placeholder={t('customer.email')}
                value={email}
                setValue={setEmail}
                setError={setError}
                length={100} />
              <Select
                label={t('customer.city')}
                placeholder={t('customer.location1')}
                value={descr}
                setValue={onChangeDescr}
                setError={setError}
                data={branch}
                s_value='branchCode' s_descr='branchName' />
              <Select
                label={t('customer.district')}
                placeholder={t('customer.location1')}
                value={subDescr}
                setValue={setSubDescr}
                setError={setError}
                data={subBranch}
                s_value='subBranchCode' s_descr='subBranchName' />
              <Coordinate
                label={t('customer.location')}
                placeholder={t('customer.location')}
                value={location}
                className='store_descr'
                onClick={onClickLocation} />
              <Input
                label={t('customer.address')}
                placeholder={t('customer.address1')}
                value={address}
                setValue={setAddress}
                setError={setError}
                length={192} />
              <Input
                label={t('customer.code1')}
                placeholder={t('customer.code')}
                value={custCode}
                setValue={setCustCode}
                setError={setError} />
              <Input
                label={t('customer.desc')}
                placeholder={t('customer.desc')}
                value={note}
                setValue={setNote}
                setError={setError}
                length={255} />
              <div className='gap'/>
            </form>
          </div>
          {error && <Error error={error} id='m_error' />}
        </div>
        <ButtonRow
          type='submit'
          show={selected ? true : false}
          onClickCancel={() => closeModal()}
          onClickSave={onClickSave}
          onClickDelete={onClickDelete} />
      </Overlay>
    </Modal>
  );
}