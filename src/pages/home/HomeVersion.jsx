import React, { useEffect, useState } from "react";
import { RiChatHistoryFill } from "react-icons/ri";
import useMeasure from "react-use-measure";

import { Empty3 } from "../../components/all";

export function HomeVersion(props){
  const { tab, getData, versions } = props;
  const [id, setId] = useState('ver_item_large');
  const [ref, bounds] = useMeasure();
  
  useEffect(() => {
    if(tab === 'version') getData();
    return () => {};
  }, [tab]);

  useEffect(() => {
    setId(bounds?.width >= 800 ? 'ver_item_large' : 'ver_item_small');
    return () => {};
  }, [bounds?.width]);

  const renderItem = (item, index) => {
    const id1 = index === 0 ? 'ver_dot1' : '';

    return (
      <div key={index} id={id}>
        <div className='row_center'>
          <div className='ver_dot' id={id1} />
          <p className='ver_text'>{item?.verisionDate}</p>
        </div>
        <div className="ver_col">
          <p className='ver_text2'>{item?.versionTitle}</p>
          <div className='ver_text3' dangerouslySetInnerHTML={{ __html: item?.versionDescr || '' }}/>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className='hm_back1'>
      <div id='hm_back2' className="y_scroll">
        <Empty3 data={versions} icon={<RiChatHistoryFill className="empty_icon" />} />
        {versions?.map(renderItem)}
      </div>
    </div>
  );
}

/**
comment
import React, {useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';
import { Overlay } from '../../../components/all';

function Card(props) {
  const { updateData, loading, getData, size } = props;
  const [maxHeight, setMaxHeight] = useState('300px');

  useEffect(() => {
    getData();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(size?.width >= 870) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 49px - 10px - 37px)');
    else if(size?.width < 870 && size?.width >= 660) setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 113px - 10px - 37px)');
    else setMaxHeight('calc(100vh - var(--header-height) - var(--page-padding) * 3 - 7px - 162px - 10px - 37px)');
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size?.width]);

  const renderItem = (item, index) => {
    let fillColor = '#4baf4f', color= 'transparent';

    return (
      <div key={item?.verisionDate} className='up_back'>
        
      </div>
    )
  };
  return (
    
  );
}

const withSizeHOC = withSize();
export const Update = withSizeHOC(Card);

 */