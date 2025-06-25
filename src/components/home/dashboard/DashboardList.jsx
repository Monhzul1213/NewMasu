import React, { useEffect, useState } from "react";
import { FaShoppingBasket } from "react-icons/fa";
import { PiReceiptFill } from "react-icons/pi";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { formatNumber } from "../../../helpers";
import { Empty3 } from "../../all";

export function DashboardList(props){
  const { pgWidth, data } = props;
  const { t } = useTranslation();
  const [width, setWidth] = useState(250);
  const [maxHeight, setMaxHeight] = useState('423px');
  const [minHeight, setMinHeight] = useState(10);
  const currency = useSelector(state => state.login?.user?.msMerchant?.currency ?? '');
  
  useEffect(() => {
    setWidth(pgWidth >= 1310 ? 250 : 360);
    setMaxHeight(pgWidth >= 1310 ? '423px' : 'calc(100vh - var(--header1-height) - var(--page-padding) * 7 - 60px)');
    setMinHeight(pgWidth >= 1310 ? '423px' : 0);
    return () => {};
  }, [pgWidth]);

  const renderItem = (item, index) => {
    return (
      <li key={index} className='dash_list_item'>
        <PiReceiptFill className="dash_list_img" style={{ color: item?.color }} />
        <div className="flex">
          <p className="dash_list_item_title">{item?.title}</p>
          <div className="row_center">
            <FaShoppingBasket className="dash_list_item_icon" />
            <p className="dash_list_item_qty">{item?.qty}</p>
          </div>
        </div>
        <div className="dash_list_item_row">
          <p className="dash_list_item_amt">{formatNumber(item?.amt)}{currency}</p>
          <p className="dash_list_item_status" style={{ backgroundColor: item?.color }}>{item?.status}</p>
        </div>
      </li>
    );
  }

  return (
    <div className='dash_list_cont' style={{ width }}>
      <p className="dash_list_title">{t('home.invoices')}</p>
      <div className="line" />
      <ul className="dash_list" style={{ maxHeight, minHeight }}>
        <Empty3 data={data} icon={<PiReceiptFill className="empty_icon" />} />
        {data?.map(renderItem)}
      </ul>
    </div>
  );
}