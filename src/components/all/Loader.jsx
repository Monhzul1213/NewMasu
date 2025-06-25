import React from 'react';
import { Spin } from 'antd';
import ClipLoader from 'react-spinners/ClipLoader';
import LoadingOverlay from 'react-loading-overlay-ts';

export function Loader(props){
  const { className, color } = props;

  return (
    <div className={className}>
      <ClipLoader color={color ?? '#25a0fe'} size={20} />
    </div>
  );
}

export function Loading(props){
  const { loading } = props;
  return (<Spin size="large" fullscreen spinning={loading} />);
}

export function Loading1(props){
  const { loading, children } = props;
  return (
    <Spin size="large" spinning={loading}>
      {children}
    </Spin>
  );
}

export function Overlay(props){
  const { loading, children, className } = props;

  let styles = { overlay: base => ({...base, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 'var(--radius)' }) };
  
  return (
    <LoadingOverlay className={className} styles={styles} active={loading} spinner>
      {children}
    </LoadingOverlay>
  );
}