// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Route, Routes, Navigate } from "react-router";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PeoplePage from "./pages/PeoplePage";
import AccountPage from "./pages/AccountPage";
import EditAccountPage from "./pages/EditAccountPage";
import AssignmentPage from "./pages/AssignmentPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import MarkingPage from "./pages/MarkingPage";
import MarkerPage from "./pages/MarkerPage";


function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/peoples" element={<PeoplePage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/edit-account" element={<EditAccountPage />} />
        <Route path="/assignment" element={<AssignmentPage />} />
        <Route path="/assignment/create" element={<CreateAssignmentPage />} />
        <Route path="/marking" element={<MarkingPage />} />
        <Route path="/marker" element={<MarkerPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
        <Route path="/people" element={<PeoplePage />} />
      </Routes>
    </>
  );
}

export default App;
