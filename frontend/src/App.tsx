// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EditStudy from "./pages/EditStudy";
import Login from "./pages/Login";
import ParticipantDashboard from "./pages/ParticipantDashboard";
import ParticipantLogin from "./pages/ParticipantLogin";
import ParticipantResponses from "./pages/ParticipantResponses";
import ParticipantMessage from "./pages/ParticipantMessage";
import Register from "./pages/Register";
import ResearcherNewStudy from "./pages/ResearcherNewStudy";
import ResearcherStudyDetail from "./pages/ResearcherStudyDetail";
import ResearcherNewTask from "./pages/ResearcherNewTask";
import ResearcherQuestions from "./pages/ResearcherQuestions";
import ResearcherParticipants from "./pages/ResearcherParticipants";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<ParticipantLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/ParticipantDashboard"
          element={<ParticipantDashboard />}
        />
        <Route path="/ResearcherDashboard" element={<ResearcherDashboard />} />
        <Route path="/EditStudy/:studyId" element={<EditStudy />} />
        <Route path="/ParticipantMessage" element={<ParticipantMessage />} />
        <Route
          path="/ParticipantResponses"
          element={<ParticipantResponses />}
        />
        <Route
          path="/ResearcherStudyDetail"
          element={<ResearcherStudyDetail />}
        />
        <Route path="/ResearcherNewStudy" element={<ResearcherNewStudy />} />
        <Route path="/ResearcherNewTask" element={<ResearcherNewTask />} />
        <Route path="/ResearcherQuestions" element={<ResearcherQuestions />} />
        <Route
          path="/ResearcherParticipants"
          element={<ResearcherParticipants />}
        />
      </Routes>
    </Router>
  );
};

export default App;
