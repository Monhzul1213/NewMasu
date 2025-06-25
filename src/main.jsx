import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import '@ant-design/v5-patch-for-react-19';

import './index.css'
import './i18n';
import App from './App.jsx'
import { persistor, store } from './services/store';
import { Loading } from './pages/login';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
