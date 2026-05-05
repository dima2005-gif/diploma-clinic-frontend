import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import PatientDashboard from "./pages/Patient/PatientDashboard";
import DirectoryOfServices from "./pages/Patient/ServicesDashboard";
import AnalysisList from "./pages/Patient/AnalysisDashboard";
import AnalysisDetail from "./pages/Patient/AnalysisDetail";
import ServiceDetail from "./pages/Patient/ServiceDetail";
import MedicalHistory from "./pages/Patient/MedicalHistoryDashboard";
import MedicalHistoryDetail from "./pages/Patient/MedicalHistoryDetail";
import VisitsList from "./pages/Patient/VisitsList";
import CreateVisit from "./pages/Patient/VisitCreate";
import UpdateVisit from "./pages/Patient/VisitUpdate";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorVisitsList from "./pages/Doctor/VisitsList";
import DoctorVisitDetail from "./pages/Doctor/VisitDetail";
import MedicalHistoryAccordion from "./pages/Doctor/MedicalHistory";
import LaborantDashboard from "./pages/Laborant/LaborantDashboard";
import LaborantAnalysisList from "./pages/Laborant/AnalysisList";
import LaborantAnalysisDetail from "./pages/Laborant/AnalysisDetail";
import RegisterPatientsList from "./pages/Register/RegisterPatientList";
import RegisterPatientDetail from "./pages/Register/RegisterPatientDetail";
import RegisterPatientCreate from "./pages/Register/RegisterPatientCreate";
import RegisterPatientEdit from "./pages/Register/RegisterPatientEdit";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/patient"
          element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/services"
          element={
            <PrivateRoute>
              <DirectoryOfServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/analysis"
          element={
            <PrivateRoute>
              <AnalysisList />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/analysis/:id"
          element={
            <PrivateRoute>
              <AnalysisDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/services/:id"
          element={
            <PrivateRoute>
              <ServiceDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/medical-history"
          element={
            <PrivateRoute>
              <MedicalHistory />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/medical-history/:id"
          element={
            <PrivateRoute>
              <MedicalHistoryDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/visit/"
          element={
            <PrivateRoute>
              <VisitsList />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/visit/create/"
          element={
            <PrivateRoute>
              <CreateVisit />
            </PrivateRoute>
          }
        />
        <Route
          path="/patient/visit/:id/update/"
          element={
            <PrivateRoute>
              <UpdateVisit />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/"
          element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/visit/"
          element={
            <PrivateRoute>
              <DoctorVisitsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/doctor/visit/:id/"
          element={
            <PrivateRoute>
              <DoctorVisitDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/doctor/visit/:id/medical-history/:patientId"
          element={
            <PrivateRoute>
              <MedicalHistoryAccordion />
            </PrivateRoute>
          }
        />

        <Route
          path="/laborant/"
          element={
            <PrivateRoute>
              <LaborantDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/laborant/analyses/"
          element={
            <PrivateRoute>
              <LaborantAnalysisList />
            </PrivateRoute>
          }
        />

        <Route
          path="/laborant/analyses/:id/"
          element={
            <PrivateRoute>
              <LaborantAnalysisDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/register/"
          element={
            <PrivateRoute>
              <RegisterPatientsList />
            </PrivateRoute>
          }
        />

        <Route
          path="/register/:id/"
          element={
            <PrivateRoute>
              <RegisterPatientDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/register/create/"
          element={
            <PrivateRoute>
              <RegisterPatientCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/register/:id/edit/"
          element={
            <PrivateRoute>
              <RegisterPatientEdit />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
