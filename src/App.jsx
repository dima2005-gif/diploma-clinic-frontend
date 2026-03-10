import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DirectoryOfServices from "./pages/Patient/ServicesDashboard";
import AnalysisList from "./pages/Patient/AnalysisDashboard";
import AnalysisDetail from "./pages/Patient/AnalysisDetail";
import ServiceDetail from "./pages/Patient/ServiceDetail";
import MedicalHistory from "./pages/Patient/MedicalHistoryDashboard";
import MedicalHistoryDetail from "./pages/Patient/MedicalHistoryDetail";
import VisitsList from "./pages/Patient/VisitsList";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/patient" element={<PatientDashboard />} />
        <Route path="/patient/services" element={<DirectoryOfServices />} />
        <Route path="/patient/analysis" element={<AnalysisList />} />
        <Route path="/patient/analysis/:id" element={<AnalysisDetail />} />
        <Route path="/patient/services/:id" element={<ServiceDetail />} />
        <Route path="/patient/medical-history" element={<MedicalHistory />} />
        <Route
          path="/patient/medical-history/:id"
          element={<MedicalHistoryDetail />}
        />
        <Route path="/patient/visit/" element={<VisitsList />} />
      </Routes>
    </Router>
  );
}

export default App;
