import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { setCollapsed } from "../../services";
import { collapse, header_image } from "../../assets";

export function Logo(){
  const collapsed = useSelector(state => state.temp.collapsed);
  const dispatch = useDispatch();
  
  const onClick = () => dispatch(setCollapsed(!collapsed));

  return (
    <div className='menu_img_container'>
      {!collapsed ? <img className='h_logo' src={header_image} alt='header_image'/> : ''}
      <button className='h_icon_btn' onClick={onClick}>
        <img src={collapse} className='h_icon' alt='collapse'/>
      </button>
    </div>
  );
}