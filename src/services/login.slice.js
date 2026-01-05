import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_URL } from '../helpers';

const initialState = {
  token: '',
  user: null,
  webUser: null,
  toRemember: false,
  isOwner: false,
  partnerUser: null,
  toPartnerRemember: false,
  isPartner: false,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.webUser = action.payload;
      state.isPartner = false;
    },
    setPartnerUser: (state, action) => {
      state.user = action.payload;
      state.partnerUser = action.payload;
      state.isPartner = true;
      state.isOwner = false;
    },
    setIsOwner: (state, action) => {
      state.isOwner = action.payload;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isOwner = false;
    },
    setLogin: (state, action) => {
      state.toRemember = action.payload?.toRemember;
    },
    setPartnerLogin: (state, action) => {
      state.toPartnerRemember = action.payload?.toPartnerRemember;
    },
  }
});

export const apiRegister = (data, url) => async dispatch => {
  try {
    const config = {
      method: 'POST',
      url: API_URL + (url ?? 'Merchant/register'),
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, 
      data
    };
    const response = await fetchRetryLogin(config);
    if(!response || response?.rettype || response?.rettype === undefined){
      return Promise.resolve({ error: response?.retdesc ?? (response?.rettype === undefined ? response?.toString() : 'Алдаа гарлаа.') });
    } else {
      return Promise.resolve({ error: null });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
}

export const apiLogin = (mail, password, fromAd) => async dispatch => {
  try {
    const config = {
      method: 'POST',
      url: API_URL + 'Merchant/login',
      headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, 
      data: { mail, password }
    };
    const response = await fetchRetryLogin(config);
    if(!response || response?.result){
      return Promise.resolve({ error: response?.message ?? 'Алдаа гарлаа.' });
    } else {
      if(!fromAd){
        let isOwner = mail?.trim()?.toLowerCase() === response?.msMerchant?.email?.trim()?.toLowerCase();
        dispatch(setIsOwner(isOwner));
        dispatch(setToken(response?.token));
        dispatch(setUser({
          mail,
          password,
          isAdmin: response?.isAdmin === 'Y',
          approvedLevel1: response?.approvedLevel1 === 'Y',
          approvedLevel2: response?.approvedLevel2 === 'Y',
          merchantId: response?.merchantId,
          msRole: response?.msRole,
          msMerchant: response?.msMerchant,
          useInventoryManagement: response?.useInventoryManagement === 'Y',
          useAppointment: response?.useAppointment === 'Y',
        }));
      }
      return Promise.resolve({
        error: null,
        token: response?.token,
        viewReport: response?.msRole?.webViewSalesReport === 'Y',
        isAdmin: response?.isAdmin === 'Y',
        msMerchant: response?.msMerchant
      });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};
export const apiValidate = mail => async dispatch => {
  try {
    const config = {
      method: 'GET',
      url: API_URL + 'Merchant/validate/' + mail,
      headers: { 'Accept': '*/*' }, 
    };
    const response = await fetchRetryLogin(config);
    return Promise.resolve({ response });
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

export const apiRecovery = email => async dispatch => {
  try {
    const config = {
      method: 'POST',
      url: API_URL + 'Merchant/Recovery',
      headers: { email }, 
    };
    const response = await fetchRetryLogin(config);
    if(!response || response?.rettype || response?.rettype === undefined){
      return Promise.resolve({ error:
        response?.retdesc ?? (response?.rettype === undefined ? response?.toString() : 'Алдаа гарлаа.') });
    } else {
      return Promise.resolve({ error: null, password: response?.retdata });
    }
  } catch (err) {
    console.log(err);
    return Promise.resolve({ error: err?.toString() });
  }
};

// export const qpayLogin = () => async dispatch => {
//   try {
//     const token = `TEST_MERCHANT:123456`;
//     const encodedToken = Buffer.from(token).toString('base64');
//     const session_url = 'https://merchant.qpay.mn/v2/auth/token';

//     const config = { method: 'POST', url: session_url, headers: { 'Authorization': 'Basic '+ encodedToken }};
//     const response = await fetchRetryLogin(config);
//     if(!response || response?.error_code){
//       return Promise.resolve({ error: response?.description ?? 'Алдаа гарлаа.' });
//     } else {
//       return Promise.resolve({ error: null, token: response?.access_token });
//     }
//   } catch (err) {
//     return Promise.resolve({ error: err?.toString() });
//   }
// };

// export const partnerLogin = (partnerCode, password) => async dispatch => {
//   try {
//     const config = {
//       method: 'POST',
//       url: API_URL + 'Merchant/LoginPartner',
//       headers: { 'Content-Type': 'application/json', 'Accept': '*/*' }, 
//       data: { partnerCode, password }
//     };
//     const response = await fetchRetryLogin(config);
//     if(!response || response?.result || response?.rettype){
//       return Promise.resolve({ error: response?.message ?? response?.retdesc ?? 'Алдаа гарлаа.' });
//     } else {
//       dispatch(setToken(response?.retdata?.token));
//       let user = {...response?.retdata?.user, password };
//       dispatch(setPartnerUser(user));
//       return Promise.resolve({ error: null, token: response?.retdata?.token });
//     }
//   } catch (err) {
//     console.log(err);
//     return Promise.resolve({ error: err?.toString() });
//   }
// };

function fetchRetryLogin(config, retries = 5) {
  return axios(config)
    .then(res => {
      return res?.data;
    }).catch(error => {
      console.log(error)
      if(error?.message === 'Network Error' && retries > 0){
        console.log('retrying network', retries);
        return fetchRetryLogin(config, retries - 1)
      }
      else return { result: 444, rettype: 444, message: error?.message, retdesc: error?.message };
    });
}

// export const qpayQR = (token, invoiceNo, amount) => async dispatch => {
//   try {
//     let data = {
//       "invoice_code": "TEST_INVOICE",
//       "sender_invoice_no": invoiceNo,
//       "invoice_receiver_code": "terminal",
//       "invoice_description":"test",
//       "sender_branch_code":"SALBAR1",
//       "amount":amount,
//       "callback_url":"https://bd5492c3ee85.ngrok.io/payments?payment_id=1234567"
//     }
//     let config = {
//       method: 'POST',
//       url: 'https://merchant.qpay.mn/v2/invoice',
//       headers: { 'Authorization': 'Bearer '+ token, "Content-Type": "application/json" },
//       withCredentials: true,
//       data
//     };
//     const response = await fetchRetrySend(config);
//    if(response?.error_code && response?.error_code !== 200){
//       return Promise.resolve({ error: response?.description, error_code: response?.error_code });
//     } else  {
//       return Promise.resolve({ error: null, data: response?.data });
//     }
//   } catch (err) {
//     return Promise.resolve({ error: err?.toString() });
//   }
// }

// function fetchRetrySend(config, retries = 0) {
//   return axios(config)
//     .then(res => {
//       return res?.data;
//     }).catch(error => {
//       if(error?.message === 'Network Error' && retries > 0){
//         console.log('retrying network', retries);
//         return fetchRetrySend(config, retries - 1)
//       } else {
//         return Promise.resolve({ description: error?.message, error_code: 100 });
//       }
//     });
// }

export const { setToken, setUser, setLogin, logout, setIsOwner } = loginSlice.actions;

export const loginReducer = loginSlice.reducer;