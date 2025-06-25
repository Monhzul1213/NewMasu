import React, { useEffect, useState } from "react";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";

import { flag_cn, flag_en, flag_gr, flag_kr, flag_mn } from "../../assets/flags";
import { DynamicMDIcon } from "../all";

export function LoginLanguage(props){
  const { id, className, fromMenu } = props;
  const { i18n } = useTranslation();
  const [src, setSrc] = useState({ image: flag_mn });

  useEffect(() => {
    if(i18n?.language === 'kr') setSrc({ image: flag_kr, text: 'KO' });
    else if(i18n?.language === 'en') setSrc({ image: flag_en, text: 'EN' });
    else if(i18n?.language === 'cn') setSrc({ image: flag_cn, text: 'ZH' });
    else if(i18n?.language === 'gr') setSrc({ image: flag_gr, text: 'DE' });
    else setSrc({ image: flag_mn, text: 'MN' });
    return () => {};
  }, [i18n?.language]);

  const onClick = ({ key }) => i18n.changeLanguage(key);

  const items = [
    {
      key: 'en',
      label: (
        <div className='menu_language_back' >
          <img src={flag_en} alt='Logo' className='menu_language_logo' />
          <span className='menu_language'>EN</span>
        </div>
      )
    }, {
      key: 'mn',
      label: (
        <div className='menu_language_back'>
          <img src={flag_mn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>МN</span>
        </div>
      )
    }, {
      key: 'kr',
      label: (
        <div className='menu_language_back'>
          <img src={flag_kr} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>KO</span>
        </div>
      )
    }, {
      key: 'cn',
      label: (
        <div className='menu_language_back'>
          <img src={flag_cn} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>ZH</span>
        </div>
      )
    }, {
      key: 'gr',
      label: (
        <div className='menu_language_back'>
          <img src={flag_gr} alt='Logo' className='menu_language_logo'/>
          <span className='menu_language'>DE</span>
        </div>
      )
    }
  ];

  return (
    <div className={className ?? 'login_language_back'}>
      <Dropdown menu={{ items, onClick }} trigger={['click']} placement="bottomRight">
        <div className='menu_language_btn'>
          <img src={src?.image} alt='Logo' className='menu_language_logo' />
          <span className='menu_language_link' onClick={e => e.preventDefault()} id={id}>{src?.text}</span>
          {!fromMenu && <DynamicMDIcon name='MdKeyboardArrowDown' size={20} className='down_icon_back2' />}
        </div>
      </Dropdown>
    </div>
  );
}