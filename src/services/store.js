import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

import { loginReducer } from './login.slice';
import { tempReducer } from './temp.slice';

const reducers = combineReducers({
  login: loginReducer,
  temp: tempReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['temp'],
}

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
});

let persistor = persistStore(store);

export { store, persistor };