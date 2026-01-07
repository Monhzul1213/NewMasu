import React from 'react';

export function Header(props){
  const { header, image64 } = props;

  return (
    <div className='inv_header_back' style={{width: 465, padding: 5}}>
      <div className='inv_row'>
        <p className='inv_header_text' style={{fontSize: 13}}>НЭХЭМЖЛЭХ</p>
        <p className='inv_header_text1' style={{fontSize: 11}}>№{header?.salesNo ?? '3930293093999'}</p>
      </div>
      <div>
      {image64 ? <img src={image64} alt='LOGO' className='inv_header_image' style={{height: 25}}/> : null}
      </div>
    </div>
  );
}