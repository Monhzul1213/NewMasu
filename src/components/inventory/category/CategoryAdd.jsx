import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import useMeasure from "react-use-measure";

import { deleteRequest, getConstants, sendRequest } from "../../../services";
import { icons1 } from "../../../assets/categories";
import { ButtonRow, CheckBox, Error, Input, Overlay, ModalTitle, Select } from "../../all";

export function CategoryAdd(props){
  const { visible, selected, useConfig, closeModal } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState({ value: '' });
  const [icon, setIcon] = useState(null);
  const [class1, setClass1] = useState({ value: 1 });
  const [categoryClass, setCategoryClass] = useState([]);
  const [useKitchen, setUseKitchen] = useState(false);
  const [ref, bounds] = useMeasure();
  const { user, token } = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(visible) getData();
    return () => {};
  }, [visible]);

  const getData = async () => {
    setError(null);
    setName({ value: selected?.categoryName ?? '' });
    setUseKitchen(selected?.useKitchenPrinter === 'Y');
    const hasClass = selected?.class || selected?.class === 0;
    setClass1({ value: hasClass ? selected?.class : 1 });
    setIcon(hasClass ? selected?.icon : 1);
    getClasses();
  }

  const getClasses = async () => {
    if(!categoryClass?.length){
      setError && setError(null);
      setLoading(true);
      const response = await dispatch(getConstants(user, token, 'msCategory_Class'));
      if(response?.error) setError && setError(response?.error);
      else setCategoryClass(response?.data?.sort((a, b) => a.valueNum - b.valueNum));
      setLoading(false);
    }
  }

  const onChangeClass = value => {
    setClass1(value);
    setIcon(icons1 && icons1[value?.value] && icons1[value?.value][0] && icons1[value?.value][0]?.value);
  }

  const onClickSave = async e => {
    e?.preventDefault();
    setError(null);
    let nameLength = 2;
    let isNameValid = name?.value?.length >= nameLength;
    if(isNameValid && icon){
      setLoading(true);
      let useKitchenPrinter = useKitchen ? 'Y' : 'N';
      let data = selected
        ? [{ categoryId: selected?.categoryId, categoryName: name?.value, color: 0, icon, class: class1?.value, useKitchenPrinter, viewPriority: selected?.viewPriority }]
        : { merchantID: user?.merchantId, categoryName: name?.value, color: 0, icon, class: class1?.value, useKitchenPrinter, viewPriority: 0 };
      let api = selected ? 'Inventory/UpdateCategory' : 'Inventory/AddCategory';
      const response = await dispatch(sendRequest(user, token, api, data));
      if(response?.error) setError(response?.error);
      else {
        closeModal(true, response?.data?.categoryId);
        toast.success(t('category.add_success'));
      }
      setLoading(false);
    } else {
      if(!name?.value) setName({ value: '', error: t('error.not_empty') });
      else if(!isNameValid) setName({ value: name.value, error: ' ' + nameLength + t('error.longer_than') })
      if(!icon) setError(t('category.icon') + '' + t('error.not_empty'))
    }
  }

  const onClickDelete = async () => {
    setError(null);
    setLoading(true);
    const response = await dispatch(deleteRequest(user, token, 'Inventory/DeleteCategory/' + selected?.categoryId));
    setLoading(false);
    if(response?.error) setError(response?.error);
    else {
      closeModal(true);
      toast.success(t('category.delete_success'));
    }
  }

  const renderItem = (item, index) => {
    const selected = item?.value === icon;
    const height = ((bounds?.width ?? 360) - 70) / 5;
    const style = { width: height, height: height, borderColor: selected ? 'var(--tag2-color)' : 'transparent' };
    return (
      <div key={index} className='color_btn' style={style} onClick={() => setIcon(item?.value)}>
        <img src={item?.icon} className={selected ? 'color_btn_active' : 'color_btn_icon'} alt={'icon' + (item?.value)} />
      </div>
    );
  }
  
  return (
    <Modal title={null} footer={null} closable={false} open={visible} centered={true} width={400}>
      <Overlay loading={loading}>
        <div className='m_back'>
          <ModalTitle icon='MdOutlineCategory' title={t(selected ? 'category.edit' : 'category.add')} isMD={true} />
          <div className='m_scroll'>
            <Input
              label={t('category.name')}
              placeholder={t('category.name')}
              value={name}
              setValue={setName}
              setError={setError}
              length={20} />
            <Select
              label={t('category.class')}
              placeholder={t('category.class')}
              data={categoryClass}
              value={class1}
              setValue={onChangeClass}
              setError={setError}
              s_value='valueNum' s_descr='valueStr1' />
            <div ref={ref} className='color_back'>
              {icons1 && icons1[class1?.value]?.map(renderItem)}
            </div>
            {useConfig && <CheckBox label={t('category.use_kitchen')} checked={useKitchen} setChecked={setUseKitchen} />}
            {error && <Error error={error} id='m_error' />}
          </div>
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