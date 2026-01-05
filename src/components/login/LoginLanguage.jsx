import React from "react";
import { Dropdown } from "antd";
import { useTranslation } from "react-i18next";

export function LoginLanguage(props){
  const { id, className } = props;
  const { i18n } = useTranslation();


  const onClick = ({ key }) => i18n.changeLanguage(key);

  const languageList = [
    { key: 'mn', label: 'Mongolian', lang: 'МОН' },
    { key: 'en', label: 'English', lang: 'ENG' },
    { key: 'jp', label: 'Japanese', lang: '日本語' },
    { key: 'kr', label: 'Korean', lang: '한국어' },
    { key: 'cn', label: 'Chinese', lang: '中文' },
    { key: 'gr', label: 'German', lang: 'DEU' }
  ];

  const items = languageList.map(item => ({
    key: item?.key,
    label: (
      <div className="menu_language_back2">
        <span
          className="menu_language"
          style={{ width: 30, fontSize: 10, marginTop: 2, textAlign: "center" }}
        >
          {item?.lang}
        </span>
        <p style={{ margin: 0 }}>-</p>
        <span className="menu_language">{item?.label}</span>
      </div>
    )
  }));

  const currentLabel =
    i18n.language === 'mn' ? 'MОН' :
    i18n.language === 'en' ? 'ENG' :
    i18n.language === 'kr' ? '한국어' :
    i18n.language === 'cn' ? '中文' :
    i18n.language === 'gr' ? 'DEU' :
    '日本語';

  return (
    <div className={className ?? 'login_language_back'}>
      <Dropdown menu={{ items, onClick }} trigger={['click']} placement="bottomRight">
        <div className='menu_language_btn'>
          <span className={'menu_language_link'} onClick={e => e.preventDefault()} id={id}>
            {currentLabel}
          </span>
        </div>
      </Dropdown>
    </div>
  );
}