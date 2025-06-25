import React, { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { calcWidth } from "../../../helpers";
import { DynamicAIIcon, Money } from "../../all";
import { DetailAr, DetailSales, DetailRemain} from "./card";

export function DashboardCard(props){
  const { pgWidth, sales, salesData, ar, arData, setId, remain, remainData, order, orderData } = props;
  const { t } = useTranslation();
  const [width, setWidth] = useState(250);
  const [salesVisible, setSalesVisible] = useState(false);
  const [arVisible, setArVisible] = useState(false);
  const [reVisible, setReVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(pgWidth >= 1310) setWidth(calcWidth(1310, 5));
    else if(pgWidth < 1310 && pgWidth >= 1045) setWidth(calcWidth(pgWidth, 4));
    else if(pgWidth < 1045 && pgWidth >= 780) setWidth(calcWidth(pgWidth, 3));
    else if(pgWidth < 780 && pgWidth >= 515) setWidth(calcWidth(pgWidth, 2));
    else if(pgWidth < 515) setWidth(calcWidth(pgWidth, 1));
    setId(pgWidth >= 1310 ? 'dash_row_large' : 'dash_row_small');
    return () => {};
  }, [pgWidth]);

  const onClickSales = () => setSalesVisible(true);
  const onClickAr = () => setArVisible(true);
  const onClickRemain = () => setReVisible(true);

  const cardProps = { width };

  return (
    <div className="dash_card_back">
      {salesVisible && <DetailSales visible={salesVisible} setVisible={setSalesVisible} data1={salesData} />}
      {arVisible && <DetailAr visible={arVisible} setVisible={setArVisible} data1={arData} />}
      {reVisible && <DetailRemain visible={reVisible} setVisible={setReVisible} data1={remainData} />}
      <Card {...cardProps}
        bgColor='var(--config1-color)'
        title={t('home.sales')}
        value={sales?.salesAmt}
        onClick={onClickSales}
        bottom={
          <div className='dash_card_row3'>
            <FaShoppingBasket className='dash_card_basket1' />
            <p className='dash_card_count'>{sales?.salesQty ?? 0}</p>
          </div>
        }/>
      <Card {...cardProps}
        bgColor='var(--dash-color)'
        title={t('home.remain')}
        value={remain?.qty}
        onClick={onClickRemain}
        qty={true}
        bottom={<p className='dash_card_text'>{<Money value={remain?.cost}/>}</p>}
        />
      <Card {...cardProps}
        color='var(--text-color)'
        title={t('home.sales_order')}
        bottom={
          <div className='dash_card_row3' style={{backgroundColor: '#f5e751'}}>
            <FaShoppingBasket className='dash_card_basket1' />
            <p className='dash_card_count'>{sales?.salesQty ?? 0}</p>
          </div>
        } />
      <Card {...cardProps}
        color='var(--text-color)'
        title={t('home.left')}
        value={ar?.amt}
        onClick={onClickAr}
        bottom={
          <div className='dash_card_row1'>
            <p className='dash_card_text' style={{ color: 'var(--text-color)' }}><Money value={ar?.totalBeginAmt} /> | {t('home.beg_qty')}</p>
          </div>
        } />
    </div>
  );
}

function Card(props){
  const { width, bgColor, color, title, value, onClick, bottom, qty } = props;

  return (
    <div className='dash_head_back' style={{ width, backgroundColor: bgColor, borderColor: bgColor ?? 'var(--border1-color)' }}>
      <p className='dash_head_text1' style={{ color }}>{title}</p>
      <div className='dash_head_col'>
        <p className='dash_head_text2' style={{ color }}>{qty ? value ?? 0 : <Money value={value} fontSize={25} />}</p>
        <div className='dash_card_row'>
          {bottom}
          <DynamicAIIcon name='AiFillRightCircle' style={{ color }} className='dash_card_icon2' onClick={onClick} />
        </div>
      </div>
    </div>
  );
}