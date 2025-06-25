import CryptoJS from 'crypto-js';

export function encrypt(text){
  let key = CryptoJS.enc.Utf8.parse('2022120404654321');
  let iv = CryptoJS.enc.Utf8.parse('2022120404654321');
  let opts = {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  };

  let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, opts).toString();
  return encrypted;
}