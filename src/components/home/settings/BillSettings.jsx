import React from "react";
import { CheckBox, DescrInput, Input, PlainSelect, UploadImage } from "../../all";
import { useTranslation } from "react-i18next";

export function BillSettings(props){
    const { t } = useTranslation(); 
    const {changeSite, site, sites, image, setImage, setImage64, setImageType, setError, header, setHeader, setEdited, setFooter, footer, 
        options, toggleOption} = props;

    const siteProps = { value: site, setValue: changeSite, data: sites, s_value: 'siteId', s_descr: 'name', className: 'co_select' };
    const logoProps = { image, setImage, setImage64, setImageType, setError, className: 'co_image' };
    const headerProps = { value: header, setValue: setHeader, label: t('document.header'),
        placeholder: t('document.header'), setEdited, setError, length: 60, classBack: 'co_select_back', className: 'co_input' };
    const footerProps = { value: footer, setValue: setFooter, label: t('document.footer'),
        placeholder: t('document.footer'), setEdited, setError, length: 60, id: 'doc_input', classBack: 'co_select_back', className: 'co_input'};
    const printProps = {
        label: t('document.isPrint'),
        checked: options?.print,
        setChecked: () => toggleOption('print'),
    };

    const descrProps = {
        label: t('document.isDescr'),
        checked: options?.descr,
        setChecked: () => toggleOption('descr'),
    };

    const regProps = {
        label: t('document.isReg'),
        checked: options?.reg,
        setChecked: () => toggleOption('reg'),
    };

    const addressProps = {
        label: t('document.isAddress'),
        checked: options?.address,
        setChecked: () => toggleOption('address'),
    };

    const phoneProps = {
        label: t('document.isPhone'),
        checked: options?.phone,
        setChecked: () => toggleOption('phone'),
    };

    const lineProps = {
        label: t('document.isLine'),
        checked: options?.line,
        setChecked: () => toggleOption('line'),
    };

  
  return (
    <div >
        <p className='co_title'>{t('document.title')}</p>
        <PlainSelect {...siteProps} />
        <div className='gap' />
        <p className='select_lbl'>{t('document.logo')}</p>
        <UploadImage {...logoProps} />
        <Input {...headerProps} />
        <DescrInput {...footerProps} />
        <div className='main_col'>
        <CheckBox {...printProps} style={{marginTop: 10}} />
        <CheckBox {...descrProps} style={{marginTop: 10}}/>
        <CheckBox {...regProps} style={{marginTop: 10}}/>
        <CheckBox {...addressProps} style={{marginTop: 10}}/>
        <CheckBox {...phoneProps} style={{marginTop: 10}}/>
        <CheckBox {...lineProps} style={{marginTop: 10}}/>
        </div>
    </div>
  );
}