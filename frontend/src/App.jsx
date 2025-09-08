// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import { Route, Routes, Navigate } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PeoplePage from './pages/PeoplePage';
import SubjectPage from './pages/SubjectPage';

function App() {
  return (
    <Routes>
      {/* 默认 / 跳转到 /home */}
      <Route path="/" element={<Navigate to="/home" />} />
      
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/admin-login" element={<LoginPage />} />
      <Route path="/marker-login" element={<LoginPage />} />
      <Route path="/peoples" element={<PeoplePage />} />
      <Route path="/subjects" element={<SubjectPage />} />
    </Routes>
  );
}

export default App;

