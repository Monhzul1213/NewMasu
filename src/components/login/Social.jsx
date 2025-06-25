import React from 'react';
import { GrFacebookOption } from 'react-icons/gr';

import { DynamicAIIcon } from '../all';
import { twitter } from '../../assets';

export function Social(){
  // const { t } = useTranslation();

  return (
    <div className='lg_social_back'>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.facebook.com/masupos'>
        <GrFacebookOption className='lg_social' style={{fontSize: 20}} />
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://twitter.com/masupos'>
        <img style={{width: 16}} src={twitter} alt='Twitter'/>
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.instagram.com/app.masu.mn/'>
        <DynamicAIIcon name='AiFillInstagram' className='lg_social' />
      </a>
      <a className='lg_social_link' target='_blank' rel='noreferrer' href='https://www.youtube.com/channel/UCYbdLbekzT4LpM37KLRO0yg'>
        <DynamicAIIcon name='AiFillYoutube' className='lg_social' />
      </a>
    </div>
  );
}