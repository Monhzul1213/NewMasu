import React from 'react';

export function Info(props){
  const { header } = props;

  return (
    <div className='inv_row1'>
      <p className='inv_info_h' style={{fontSize: 'var(--item-font)'}}>Нэхэмжлэгч</p>
      <p className='inv_info_h' style={{fontSize: 'var(--item-font)'}}>Төлөгч</p>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Байгууллага:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.cashierName ?? 'Masu Pos ХХК'}</p>
      </div>
      <div style={{ display: 'flex' }} >
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Байгууллага:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.custName ?? '__________________'}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Хаяг:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.address ?? 'СБД, Twin Tower II'}</p>
      </div>
      <div style={{ display: 'flex' }} >
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Хаяг:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.address ?? '__________________'}</p>
      </div>

      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Утас:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.phone ?? '95082022'}</p>
      </div>
      <div style={{ display: 'flex' }}>
        <p className='inv_info' style={{fontSize: 'var(--item-font)'}}>Утас:</p>
        <p className='inv_info1' style={{fontSize: 'var(--item-font)'}}>{header?.custPhone ?? '__________________'}</p>
      </div>
    </div>
  );
}
