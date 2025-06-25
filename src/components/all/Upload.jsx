import React, { useState } from "react";
import { Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { BiImport } from 'react-icons/bi';
import { toast } from "react-hot-toast";

import { checkMimeType } from "../../helpers";

const { Dragger } = Upload;

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function UploadDrag(props){
  const { file, setFile, types } = props;
  const [loading, setLoading] = useState(false);

  const dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0);

  const onChange = info => {
    if(info.file.status === 'uploading'){
      setLoading(true);
      return;
    }

    const error = checkMimeType(info.file, types);
    if(error){
      toast.error(error);
      setLoading(false);
      setFile(null);
    } else {
      if(info.file.status === 'done'){
        getBase64(info.file.originFileObj, base64 => {
          setFile({
            object: info.file.originFileObj,
            base64,
            type: info.file.originFileObj?.type?.replace(/(.*)\//g, ''),
            name: info.file.originFileObj?.name
          });
          setLoading(false);
        });
      }
    }
  }

  return (
    <Dragger
      name='file'
      className='upload_drag'
      multiple={false}
      maxCount={1}
      action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
      customRequest={dummyRequest}
      onChange={onChange}>
      <div className='drag_back'>
        {loading ? <LoadingOutlined className='drag_icon' /> : <BiImport className='drag_icon' />}
        <p className='drag_text'>{file?.name ?? 'Upload'}</p>
      </div>
    </Dragger>
  );
}

export function UploadImage(props){
  const { image, setImage, setImage64, setImageType, setEdited, className } = props;
  const [loading, setLoading] = useState(false);

  const handleChange = info => {
    if(info.file.status === 'uploading'){
      setLoading(true);
      return;
    }
    const error = checkMimeType(info.file);
    if(error){
      toast.error(error);
      setLoading(false);
      setImage64(null);
      setImage(null);
      setImageType(null);
    } else {
      if(info.file.status === 'done'){
        getBase64(info.file.originFileObj, image => {
          setImage(info.file.originFileObj);
          setImage64(image);
          setEdited && setEdited(true);
          let type = info.file.originFileObj?.type?.replace(/(.*)\//g, '');
          setImageType(type);
          setLoading(false);
        });
      }
    }
  };

  const dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0);

  const uploadButton = (
    <div className='upload_btn'>
      {loading ? <LoadingOutlined className='upload_icon' /> : <PlusOutlined className='upload_icon' />}
      <p className='upload_text'>Upload</p>
    </div>
  );

  return (
    <Upload
      name='avatar'
      className={className ?? 'u_image'}
      listType='picture-card'
      showUploadList={false}
      customRequest={dummyRequest}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      onChange={handleChange}>
      {image ? <img src={URL.createObjectURL(image)} alt="avatar" className='upload_image' /> : uploadButton}
    </Upload>
  );
}