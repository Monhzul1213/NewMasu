import React from 'react';

import { Money } from '../../../all';

export function Items(props){
  // const { detail } = props;

  const detail = [{
    price: '15000',
    amount: '30000',
    barCode: '12345678',
    qty: '2',
    invtId: '123',
    invtName: 'Pepsi том'
  },
  {
    price: '10000',
    amount: '100000',
    barCode: '000000123',
    qty: '10',
    invtId: '12',
    invtName: 'Fanta жижиг'
  }];

  const renderItem = (item, index) => {

    const isEven = index % 2 === 1; 
    const rowStyle = {
      backgroundColor: isEven ? '#f5f5f5' : '#ffffff' 
    };

    return (
        <div key={index} className='inv_item' style={rowStyle}>
          <p className='inv_header1' style={{fontSize: 10, justifyContent: 'center'}}>{(index + 1)}</p>
          <p className='inv_header2' style={{fontSize: 10}}>{item?.invtName}</p>
          <p className='inv_header3' style={{fontSize: 10, justifyContent: 'center'}}>{item?.qty}</p>
          <p className='inv_header4' style={{fontSize: 10, justifyContent: 'flex-end'}}><Money value={item?.price} fontSize={10} currency='₮' /></p>
          <p className='inv_header5' style={{fontSize: 10, justifyContent: 'flex-end'}}><Money value={item?.amount} fontSize={10} currency='₮' /></p>
        </div>
    );
  }
  
  return (
    <div>
      {detail?.map(renderItem)}
    </div>
  );
}