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
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminEmployeeList from "./pages/Admin/AdminEmployeeList";
import AdminEmployeeDetail from "./pages/Admin/AdminEmployeeDetail";
import AdminEmployeeCreate from "./pages/Admin/AdminEmployeeCreate";
import AdminEmployeeUpdate from "./pages/Admin/AdminEmployeeUpdate";
import AdminAnalysisList from "./pages/Admin/AdminAnalysisList";
import AdminAnalysisDetail from "./pages/Admin/AdminAnalysisDetail";
import AdminAnalysisCreate from "./pages/Admin/AdminAnalysisCreate";
import AdminAnalysisEdit from "./pages/Admin/AdminAnalysisEdit";
import AdminServicesList from "./pages/Admin/AdminServicesList";
import AdminServicesDetail from "./pages/Admin/AdminServicesDetail";
import AdminServicesCreate from "./pages/Admin/AdminServicesCreate";
import AdminServicesEdit from "./pages/Admin/AdminServicesEdit";
import AdminAudit from "./pages/Admin/AdminAudit";
import AdminStatistics from "./pages/Statistics/StatisticsDashboard";
import AdminDoctorVisitsStatistics from "./pages/Statistics/DoctorVisitsStatistics";
import AdminServicePopularityStatistics from "./pages/Statistics/ServicePopularityStatistics";
import AdminAnalysisPopularityStatistics from "./pages/Statistics/AnalysisPopularityStatistics";
import AdminDiagnosisStatistics from "./pages/Statistics/DiagnosisStatistics";
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

        <Route
          path="/administrator/"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/employees/"
          element={
            <PrivateRoute>
              <AdminEmployeeList />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/employees/:id/"
          element={
            <PrivateRoute>
              <AdminEmployeeDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/employees/create/"
          element={
            <PrivateRoute>
              <AdminEmployeeCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/employees/:id/update/"
          element={
            <PrivateRoute>
              <AdminEmployeeUpdate />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/analyses/"
          element={
            <PrivateRoute>
              <AdminAnalysisList />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/analyses/:id/"
          element={
            <PrivateRoute>
              <AdminAnalysisDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/analyses/create/"
          element={
            <PrivateRoute>
              <AdminAnalysisCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/analyses/:id/edit/"
          element={
            <PrivateRoute>
              <AdminAnalysisEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/services/"
          element={
            <PrivateRoute>
              <AdminServicesList />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/services/:id/"
          element={
            <PrivateRoute>
              <AdminServicesDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/services/create/"
          element={
            <PrivateRoute>
              <AdminServicesCreate />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/services/:id/edit/"
          element={
            <PrivateRoute>
              <AdminServicesEdit />
            </PrivateRoute>
          }
        />

        <Route
          path="/administrator/audit/"
          element={
            <PrivateRoute>
              <AdminAudit />
            </PrivateRoute>
          }
        />

        <Route
          path="administrator/statistics/"
          element={
            <PrivateRoute>
              <AdminStatistics />
            </PrivateRoute>
          }
        />

        <Route
          path="administrator/statistics/doctor-visits/"
          element={
            <PrivateRoute>
              <AdminDoctorVisitsStatistics />
            </PrivateRoute>
          }
        />
        <Route
          path="administrator/statistics/service-popularity/"
          element={
            <PrivateRoute>
              <AdminServicePopularityStatistics />
            </PrivateRoute>
          }
        />

        <Route
          path="administrator/statistics/analysis-popularity/"
          element={
            <PrivateRoute>
              <AdminAnalysisPopularityStatistics />
            </PrivateRoute>
          }
        />

        <Route
          path="administrator/statistics/diagnoses/"
          element={
            <PrivateRoute>
              <AdminDiagnosisStatistics />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
