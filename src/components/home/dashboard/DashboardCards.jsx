import React, { useEffect, useState } from "react";
import { BsFillBarChartFill } from "react-icons/bs";
import { FaPlus, FaBoxesStacked } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { calcWidth } from "../../../helpers";
import { invoice } from "../../../assets/menu";
import { DynamicAIIcon, Money } from "../../all";
import { DetailAr, DetailSales } from "./card";

export function DashboardCard(props){
  const { pgWidth, sales, salesData, ar, arData, setId } = props;
  const { t } = useTranslation();
  const [width, setWidth] = useState(250);
  const [salesVisible, setSalesVisible] = useState(false);
  const [arVisible, setArVisible] = useState(false);
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
  const onClickAdd = () => navigate('/invoice/invoice_add');

  const cardProps = { width };

  return (
    <div className="dash_card_back">
      {salesVisible && <DetailSales visible={salesVisible} setVisible={setSalesVisible} data1={salesData} />}
      {arVisible && <DetailAr visible={arVisible} setVisible={setArVisible} data1={arData} />}
      <Card {...cardProps}
        bgColor='var(--config-h-color)' icon={<BsFillBarChartFill className="dash_card_bg" />}
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
        bgColor='var(--tag2-color)' icon={<FaBoxesStacked className="dash_card_bg" />}
        title={t('home.by_invoice')}
        value={sales?.invoiceAmt}
        bottom={
          <div className='dash_card_row1'>
            <img src={invoice} className='dash_card_icon1' />
            <p className='dash_card_text'>{sales?.invoiceCount ?? 0}{t('home.invoice1')}</p>
          </div>
        } />
      <Card {...cardProps}
        color='var(--text-color)'
        title={t('home.pending')}
        bottom={
          <div className='dash_card_row1'>
            <img src={invoice} className='dash_card_icon1' style={{ filter: 'var(--warning-filter)' }} />
            <p className='dash_card_text' style={{ color: 'var(--text-color)' }}>{sales?.invoiceCount ?? 0}{t('home.invoice1')}</p>
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
      <div className='dash_head_back' style={{ width }} id='dash_card_btn' onClick={onClickAdd}>
        <FaPlus className="dash_card_btn_icon" />
        <p className="dash_card_btn_text">{t('home.create')}</p>
      </div>
    </div>
  );
}

function Card(props){
  const { width, bgColor, icon, color, title, value, onClick, bottom } = props;

  return (
    <div className='dash_head_back' style={{ width, backgroundColor: bgColor, borderColor: bgColor ?? 'var(--border1-color)' }}>
      {icon}
      <p className='dash_head_text1' style={{ color }}>{title}</p>
      <div className='dash_head_col'>
        <p className='dash_head_text2' style={{ color }}><Money value={value} fontSize={25} /></p>
        <div className='dash_card_row'>
          {bottom}
          <DynamicAIIcon name='AiFillRightCircle' style={{ color }} className='dash_card_icon2' onClick={onClick} />
        </div>
      </div>
    </div>
  );
}