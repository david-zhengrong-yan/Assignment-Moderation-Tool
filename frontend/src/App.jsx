// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import { Route, Routes } from "react-router";
import IndexPage from "./pages/IndexPage";
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={ <IndexPage /> }/>
        <Route path="/signup" element={ <SignupPage />}/>
        <Route path="home" element={ <HomePage /> } />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route path="/marker-login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
