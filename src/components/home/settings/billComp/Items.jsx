import React from 'react';

import { Money } from '../../../all';
import { bonus, coupon } from '../../../../assets'

export function Items(props){
  const { detail, showBarCode, isLine, options } = props;

  const renderItem = (item, index) => {
    // const showBarCode = bill?.isPrintBarCode === 'Y' && item?.barCode;
    const service = (item?.serviceName ?? item?.serviceCode) + (item?.serviceDescr ? (', ' + item?.serviceDescr) : '');
    return (
      <div key={index} className='bl_item'>
        <div className='bl_item_row' style={{marginTop: 2}}>
          <p className='bl_header1' style={{fontSize: 'var(--item-font)', width: '40%'}}>{options?.line && <span style={{fontSize: 'var(--footer-font)'}}>{item?.number}</span>}{item?.invtName ?? item?.invtId}</p>
          <p className='bl_header2' style={{fontSize: 'var(--item-font)', width: '15%'}}>{item?.qty}</p>
          <p className='bl_header3' style={{fontSize: 'var(--item-font)', width: '20%'}}><Money value={item?.price} fontSize={11} currency='₮' /></p>
          <p className='bl_header4' style={{fontSize: 'var(--item-font)', width: '25%'}}><Money value={item?.amount} fontSize={11} currency='₮' /></p>
        </div>
        {options?.print ? <p className='bl_item_descr' style={{fontSize: 'var(--footer-font)', marginBottom: '0'}}>{item?.barCode}</p> : null}
        {item?.serviceCode ? <p className='bl_item_descr'>{service}</p> : null}
        <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            {item?.couponAmount ? <img src={coupon} className='dr_img' alt='coupon'/> : null}
            <p className='dr_item_text_z2'>{ (item?.couponName ? item?.couponName : '')}</p>
          </div>
          <p className='dr_item_text_z2'>{item?.couponAmount ? <Money value={item?.couponAmount}/> : ''}</p>
        </div>
        {item?.bonusId ? <div className='dr_item_text_back'>
          <div className='dr_img_back'>
            <img src={bonus} className='dr_bonus_img' alt='coupon'/>
            <p className='dr_item_text_z2'>{item?.bonusName}</p>
          </div>
          <p className='dr_item_text_z2'><Money value={item?.rewardAmount}/></p>
        </div> : null}
      </div>
    );
  }
  
  return (
    <div>{detail?.map(renderItem)}</div>
  );
}