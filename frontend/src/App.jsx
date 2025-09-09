// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css';
import { Route, Routes } from "react-router";
import IndexPage from "./pages/IndexPage";
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PeoplePage from './pages/PeoplePage';
import SubjectPage from './pages/SubjectPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<IndexPage /> }/>
        <Route path="/signup" element={<SignupPage />}/>
        <Route path="/home" element={ <HomePage /> } />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route path="/marker-login" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/peoples" element={<PeoplePage />} />
        <Route path="/account" element={<AccountPage />} />
        {/* <Route path="/subjects" element={<SubjectPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
