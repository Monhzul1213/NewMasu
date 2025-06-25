import React from 'react';

import { DynamicAIIcon } from './DynamicIcon';

export function Sort(props){
  const { sorted } = props;

  return (
    <div className='table_sort'>
      <DynamicAIIcon name='AiFillCaretUp' className={sorted === 'asc' ? 'table_sort_icon_selected' : 'table_sort_icon'} />
      <DynamicAIIcon name='AiFillCaretDown' className={sorted === 'desc' ? 'table_sort_icon_selected' : 'table_sort_icon'} />
    </div>
  );
}