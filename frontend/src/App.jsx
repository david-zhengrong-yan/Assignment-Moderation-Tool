// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import { Route, Routes } from "react-router";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import EditAccountPage from "./pages/EditAccountPage";
import AssignmentPage from "./pages/AssignmentPage";
import CreateAssignmentPage from "./pages/CreateAssignmentPage";
import NotFoundPage from "./pages/NotFoundPage";
import MarkerPage from "./pages/MarkerPage";
import MarkingPage from "./pages/MarkingPage";
import EditAssignmentPage from "./pages/EditAssignmentPage";
import ViewSubmissionPage from "./pages/ViewSubmissionPage";

function App() {
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/:userId/home" element={<HomePage />} />
        <Route path="/:userId/account" element={<AccountPage />} />
        <Route path="/:userId/account/edit" element={<EditAccountPage />} />
        <Route path="/:userId/assignment/:assignmentId" element={<AssignmentPage />} />
        <Route path="/:userId/assignment/:assignmentId/edit" element={<EditAssignmentPage />} />
        <Route path="/:userId/assignment/create" element={<CreateAssignmentPage />} />
        <Route path="/:userId/marker/assignment/:assignmentId" element={ <MarkerPage />} />
        <Route path="/:userId/assignment/:assignmentId/submission/:submissionId/mark" element={ <MarkingPage />} />
        <Route path="/:userId/assignment/:assignmentId/submission/:submissionId/marks" element={ <ViewSubmissionPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
  );
}

export default App;
