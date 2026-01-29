import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider, Routes } from 'react-router'
import { Layout } from 'antd';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'

import './App.css'
import { setIsLoggedIn } from './services/temp.slice'
import { Home } from './pages/home';
import { Loading, Login, Recovery, Signup } from './pages/login'
import { Header, Menu } from './components/menu';
import { Category, Inventory, InventoryImport } from './pages/inventory';
import { Customer, CustomerImport } from './pages/customer';

export default function App() {
  const loggedIn = useSelector(state => state.temp?.loggedIn);
  const user = useSelector(state => state.login?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!window.sessionStorage.length){
      window.localStorage.setItem('getSessionStorage', Date.now());
    } else {
      dispatch(setIsLoggedIn(true));
    }
    window.addEventListener('storage', function(event){
      if(event.key === 'getSessionStorage') {
        window.localStorage.setItem('sessionStorage', Date.now());
        window.localStorage.removeItem('sessionStorage');
      } else if(event.key === 'sessionStorage' && !window.sessionStorage.length){
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        dispatch(setIsLoggedIn(true));
      } else if(event.key === 'CREDENTIALS_FLUSH'){
        dispatch(setIsLoggedIn(false));
        window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
      }
    });
    return () => {};
  }, []);

  if(!loggedIn || !user) return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/recovery' element={<Recovery />} />
          <Route path='/sign_up' element={<Signup />} />
        </Routes>
        <Toaster />
      </Suspense>
    </BrowserRouter>
  );

  return (<RouterProvider router={router} />);
}

const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Screen />}>
    <Route path='/' element={<Home />} />
    <Route path='*' element={<Home />} />
    <Route path='/home' element={<Home />} />
    <Route path='/inventory/invt_list' element={<Inventory />} />
    <Route path='/inventory/invt_list/invt_import' element={<InventoryImport />} />
    <Route path='/inventory/invt_category' element={<Category />} />
    <Route path='/customer/customer' element={<Customer />} />
    <Route path='/customer/customer_import' element={<CustomerImport />} />
  </Route>
));

function Screen(props){
  return (
    <Suspense fallback={<Loading />}>
      <Layout style={{minHeight: '100vh', width: '100vw', overflowX: 'scroll'}}>
        <Menu {...props} />
        <Layout style={{width: '100%'}}>
          <Header {...props} />
          <Outlet />
        </Layout>
      </Layout>
      <Toaster />
    </Suspense>
  );
}