import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Table from '../pages/Table';
import EditPage from '../pages/Edit';

function AppRoutes() {
  return (
    <Routes>
      {}
      <Route path="/login" element={<Login />} />
      <Route path="/table" element={<Table />} />
      <Route path="/edit/:id" element={<EditPage />} />
    </Routes>
  );
}

export default AppRoutes;