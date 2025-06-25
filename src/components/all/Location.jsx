import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useTranslation } from "react-i18next";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import { DynamicMDIcon } from "./DynamicIcon";
import { ModalTitle } from "./Field";
import { ButtonRow } from "./Button";

export function Coordinate(props){
  const { value, label, id, className, placeholder, onClick } = props;

  const style = value?.error ? { borderColor: '#e41051', color: '#e41051' } : {};

  return (
    <div style={{ position: 'relative' }}>
      <div className='select_back' style={style}>
        {label && <p className='select_lbl' style={style}>{label}</p>}
        <textarea
          id={id}
          className={className ?? 'm_input_descr'}
          disabled={true}
          placeholder={placeholder}
          value={value?.value} />
      </div>
      <DynamicMDIcon className='loc_icon' name='MdLocationPin' onClick={onClick} />
      {value?.error && <p className='f_input_error'>{value?.noLabel ? '' : label} {value?.error}</p>}
    </div>
  );
}

export function Location(props){
  const { mapVisible, closeLocation, lat, setLat, lng, setLng, city, descr1, descr2 } = props;
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLat(descr1?.value ? descr1?.value : lat);
    setLng(descr2?.value ? descr2?.value : lng);
    setLoaded(mapVisible);
    return () => {};
  }, [mapVisible]);

  const onClick = e => {
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
  }

  const mapProps = { onClick, lat, lng, city };

  return (
    <Modal title={null} footer={null} closable={false} open={mapVisible} centered={true} width={720}>
      <div className='m_back'>
        <ModalTitle icon='MdLocationPin' title={t('customer.choose_location')} isMD={true} />
        <div style={{height: 5}} />
        {loaded && <Map {...mapProps} />}
      </div>
      <ButtonRow onClickCancel={() => closeLocation()} onClickSave={() => closeLocation(true, lat, lng)} />
    </Modal>
  );
}

export function Map(props){
  const { lat, lng, onClick } = props;
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: 'AIzaSyBBVa7rlEs36Of2GeCrTe2GK981rjSpWJU' });

  return isLoaded && (
    <div style={{overflow: 'scroll'}}>
      <GoogleMap
        mapContainerStyle={{ height: '450px', width: '680px' }}
        center={{ lat, lng }}
        zoom={13}
        onClick={onClick}>
        <Marker position={{ lat, lng }}/>
      </GoogleMap>
    </div>
  );
}