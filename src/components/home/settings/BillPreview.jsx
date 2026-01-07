import React from 'react';

import '../../../css/bill.css';
import { Info, Header, Items, Total, QR } from './billComp';
import { DynamicBSIcon, Error1, Overlay } from '../../all';

export function BillPreview(props){
  const {header, footer, site, image64, loading , error, options } = props
  
  let data = [{
    price: '15000',
    amount: '30000',
    barCode: '12345678',
    qty: '2',
    invtId: '123',
    invtName: 'Pepsi том',
    number: '1000 - '
  },
  {
    price: '10000',
    amount: '100000',
    barCode: '000000123',
    qty: '10',
    invtId: '12',
    invtName: 'Fanta жижиг',
    number: '1001 - '
  }
  ];

  const infoProps = {header, site, image64, options};

  return (
    <Overlay loading={loading}>
      <div className='bl_back' id='bill_back1' style={{backgroundColor: '#f2f2f2', marginTop: 30}}>
        {error && <Error1 error={error} />}
        {!header ? <DynamicBSIcon name='BsReceipt' className='bl_empty' /> :
          <div>
          <p className='bl_footer' style={{fontSize: 'var(--value-font)', marginTop: '5px', whiteSpace: 'pre-line'}}>{header?.value}</p>
            <Info {...infoProps}/>
            <Header />
            <Items detail ={data} options={options}/>
            <Total  />
            <QR/>
            <p className='bl_footer' style={{fontSize: 'var(--value-font)', marginTop: '5px', whiteSpace: 'pre-line'}}>{footer?.value?.replace(/↵/g, '\n')}</p>
          </div>
        }
      </div>
    </Overlay>
  )
}