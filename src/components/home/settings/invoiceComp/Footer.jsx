import React from 'react';

export function Footer(props){

  return (
    <div className ='inv_footer_back'>
        <div className='iline1'/>
        <div style={{display: 'flex', flexFlow: 'row', justifyContent: 'space-between'}}>
          <p className='inv_tamga' style={{padding: 30}}>Тамга</p>
          <div >
            <p style={{fontSize: 11, fontWeight:500}}>Дарга ....................................../.........................../</p>
            <p style={{fontSize: 11, fontWeight:500}}>Хүлээн авсан .........................../.........................../</p>
            <p style={{fontSize: 11, fontWeight:500}}>Хүлээлгэн өгсөн ....................../.........................../</p>
            <p style={{fontSize: 11, fontWeight:500}}>Нягтлан бодогч ......................../.........................../</p>
          </div>
        </div>
        {/* <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
            <p style={{fontSize: 12, fontWeight: 'bold'}}>{info?.footer}</p>
        </div> */}
        <div className='inv_footer_back1'>
          <div>
            <p style={{fontSize: 11, alignItems: 'center', margin:0, color: 'white', fontWeight: 500}}>Бидэнтэй хамтран ажилласан танд баярлалаа.</p>
          </div>
          <div className='row'>
            <p style={{fontSize: 11, alignItems: 'center', margin:0, color: 'white'}}>Powered by</p>
            <a style={{marginLeft: 5, fontSize: 11, fontWeight: 500, color: 'white'}} href='https://masu.mn'>www.masu.mn</a>
          </div>
        </div>
    </div>
  );
}