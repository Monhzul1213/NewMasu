import React, { useEffect, useState } from 'react';
import { Progress } from 'antd';
import { FaRegMoneyBillAlt, FaRegCreditCard, FaShoppingBasket } from 'react-icons/fa';
import { useSelector, useDispatch} from 'react-redux';

import { calcWidth, getColor } from '../../../helpers';
import { DynamicAIIcon, DynamicBSIcon, Money } from '../../all';
// import { Detail } from '../../../../components/report/review/Detail';
import { getList } from '../../../services';

export function DashboardList(props){
  const { data, pgWidth } = props;
  const [width, setWidth] = useState(250);
  const [visible, setVisible] = useState(false);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token }  = useSelector(state => state.login);
  const dispatch = useDispatch();

  useEffect(() => {
    if(pgWidth >= 1310) setWidth(calcWidth(1310, 5));
    else if(pgWidth < 1310 && pgWidth >= 1045) setWidth(calcWidth(pgWidth, 4));
    else if(pgWidth < 1045 && pgWidth >= 780) setWidth(calcWidth(pgWidth, 3));
    else if(pgWidth < 780 && pgWidth >= 515) setWidth(calcWidth(pgWidth, 2));
    else if(pgWidth < 515) setWidth(calcWidth(pgWidth, 1));
    // setId(pgWidth >= 1310 ? 'dash_row_large' : 'dash_row_small');
    return () => {};
  }, [pgWidth]);

  const renderCard = (item, index) => {

    const onClick = async () => {
      setVisible(true);
      setLoading(true);
      let query = item?.siteID ? '?SiteID=' + item?.siteID  : '';
      let api = 'Txn/GetHandQtyDtl' + (query);
      let headers = { merchantid: user?.merchantId };
      const response = await dispatch(getList(user, token, api, null, headers));
      if(response?.error) setError(response?.error);
      setDetail(response?.data?.dtl);
      setLoading(false);
    };

    let color = getColor(1 - (index / data?.length))
    return (
      <div className='dash_head_back' key={index} style={{ width }} >
        <p className='dash_head_text1' style={{color: 'var(--text-color)'}}>{item?.siteName}</p>
        <div className='dash_card_row2' style={{margin: '10px 0'}}>
          <Progress className='dash_card_progress' percent={+item?.salesPercent?.toFixed(1)} width={70}
              strokeWidth={8} strokeColor={color} type="circle" format={(percent) => `${percent}%`} />  
          <div className='dash_card_col'>
            <div className='dash_card_type'>
              <FaRegMoneyBillAlt className='dash_card_icon1' style={{ color }} />
              <p className='dash_card_text1'><Money value={item?.cashAmount} /> </p>
            </div>
            <div className='dash_card_type'>
              <FaRegCreditCard className='dash_card_icon1' style={{ color }} />
              <p className='dash_card_text1'><Money value={item?.nonCashAmount} /> </p>
            </div>
            <div className='dash_card_type'>
              <DynamicBSIcon name='BsCardList' className='dash_card_icon1' style={{ color }} />
              <p className='dash_card_text1'>{item?.handQty ?? 0}</p> 
              <p className='dash_card_text1'>|</p>
              <p className='dash_card_text1'><Money value={item?.totalCost} /> </p>
            </div>
          </div>
        </div>
        <div className='dash_card_row'>
          <div className='dash_card_row2'>
            <div className='dash_card_row3' style={{backgroundColor: 'var(--logo1-color)'}}>
                <FaShoppingBasket className='dash_card_basket' style={{color : "var(--root-color)"}} />
                <p className='dash_card_count' style={{color : "var(--root-color)"}}> {item?.salesCount}</p>
            </div> 
            <p className='dash_card_amt'><Money value={item?.salesAmount} /></p>
          </div>
          <DynamicAIIcon name='AiFillRightCircle' onClick ={onClick} className='dash_card_icon'/>
        </div>
      </div>
    );
  }

  // const closeModal = () => {
  //   setVisible(false);
  // }

  // const detailProps = { data : detail, visible, closeModal, loading, error, size};

  return (
    <>    
      {/* {visible && <Detail {...detailProps} />} */}
      <div className='dash_card_back'>
        {data?.map(renderCard)}
      </div>
    </>

  );
}