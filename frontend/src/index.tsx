import React from 'react';
import ReactDOM from 'react-dom/client';
import HomePage from './views/Home';
import PageNotFound from './views/404';
import CreateUserPage from './views/user/CreateUser';
import GetUserPage from './views/user/GetUser';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/404' element={<PageNotFound/>}/>
        <Route path='/user'>
          <Route path='create' element={<CreateUserPage/>}/>
          <Route path='get/:id' element={<GetUserPage/>}/>
        </Route>
        <Route path='*' element={<Navigate to='/404'/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
