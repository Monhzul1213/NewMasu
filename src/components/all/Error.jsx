import React from "react";
import { useTranslation } from "react-i18next";

import { DynamicAIIcon } from "./DynamicIcon";

export function Error(props){
  const { t } = useTranslation();
  const { error, label, id } = props;

  return (
    <div className='error_back' id={id}>
      <DynamicAIIcon name='AiOutlineInfoCircle' className='error_icon' />
      <span className='error_text'>{error ?? t(label)}</span>
    </div>
  );
}

export function Error1(props){
  const { t } = useTranslation();
  const { error, label } = props;

  return (
    <div className='a_error_back'>
      <DynamicAIIcon name='AiOutlineInfoCircle' className='error_icon' />
      <span className='error_text' id='a_error_text'>{error ?? t(label)}</span>
    </div>
  );
}

export function Memo(props){
  const { text, style } = props;

  return (
    <div className='memo_back' style={style}>
      <DynamicAIIcon name='AiOutlineInfoCircle' className='memo_icon'  />
      <p className='memo_text'>{text}</p>
    </div>
  );
}