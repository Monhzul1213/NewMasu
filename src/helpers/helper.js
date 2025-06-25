import moment from "moment";

export function validateEmail(mail) {
  let emailRegex = /(^[^@]+)@([^@.]+)\.{1}(\w{1,9}$)/;
  if(mail?.match(emailRegex))
    return true;
  else
    return false;
}

const numbers = ["99","95","94","85","91","96","90","88","89","86","80","98","93","97","83"];
export function validateNumber(number){
  return number?.length === 8 && numbers?.includes(number?.substring(0, 2));
}

export function formatNumber(num, dec){
  return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: dec ?? 2 }).format(num ?? 0);
}

export const checkMimeType = (file, types1) => {
  let err = ''
  const types = types1 ?? ['image/png', 'image/jpeg', 'image/gif']
  if(types.every(type => file.type !== type)){
    err += file.type + ' формат буруу байна.';
  }

  if(err !== '') return err; 
  else return checkFileSize(file);
}

export const checkFileSize = file => {
  let size = 2000000;
  let err = ''; 
  if(file.size > size){
    err += 'Файлын хэмжээ хэт том байна.';
  }
  
  if(err !== '') return err;
  return false
}

const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

export const toHours = totalMinutes => {
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);  
  return { value: `${padTo2Digits(hours)}:${padTo2Digits(minutes)}` };
}

export const urlToFile = async (url, mimeType) => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return new File([buf], 'imagefile', { type: mimeType });
};

export const calcWidth = (wid, num) => {
  return (wid - (num - 1) * 15) / num;
}