import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DirectoryOfServices from "./pages/Patient/ServicesDashboard";
import AnalysisList from "./pages/Patient/AnalysisDashboard";
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
      </Routes>
    </Router>
  );
}

export default App;
