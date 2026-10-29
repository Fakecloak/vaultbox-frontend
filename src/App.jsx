import { useState } from 'react';
import './App.css';
import Login from './components/login.jsx';
import Register from './components/Register.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    
    </BrowserRouter>
  )
}

export default App
