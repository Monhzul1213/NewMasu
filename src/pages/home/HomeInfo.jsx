import React, { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

import { Empty3, Error1 } from "../../components/all";
import { RiChatHistoryFill } from "react-icons/ri";
import moment from "moment";

export function HomeInfo(props){
  const {tab, error, getData, infos } = props;
  const [id, setId] = useState('ver_item_large');
  const [ref, bounds] = useMeasure();

  useEffect(() => {    
    if(tab === 'info') getData();
    return () => {};
  }, [tab]);

  useEffect(() => {
    setId(bounds?.width >= 800 ? 'ver_item_large' : 'ver_item_small');
    return () => {};
  }, [bounds?.width]);

  const renderItem = (item, index) => {
    return (
        <div key={index} className='noti_item_back' id={id}>
          <p className='ver_text'>{moment(item?.createdDate)?.format('YYYY.MM.DD')}</p>
          <div>
            <p className='ver_text2'>{item?.subject}</p>
            <div className='ver_text3' dangerouslySetInnerHTML={{ __html: item?.text || '' }}/>
          </div>
        </div>
    )
  };

  return (
    <div ref={ref} className='hm_back1'>
      {error && <Error1 error={error}/>}
      <div id='hm_back2' className="y_scroll">
        <Empty3 data={infos} icon={<RiChatHistoryFill className="empty_icon" />} />
        {infos?.map(renderItem)}
      </div>
    </div>
  );
}