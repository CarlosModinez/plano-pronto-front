import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import LessonPlanDetails from './pages/LessonPlanDetails';
import AnnualPlanGenerator from './pages/AnnualPlanGenerator';
import AnnualPlanDetails from './pages/AnnualPlanDetails';
import DidacticSequenceGenerator from './pages/DidacticSequenceGenerator';
import DidacticSequenceDetails from './pages/DidacticSequenceDetails';
import ExamGenerator from './pages/ExamGenerator';
import ExamDetails from './pages/ExamDetails';
import ActivityDetails from './pages/ActivityDetails';
import StudentReportDetails from './pages/StudentReportDetails';
import MaterialsLibrary from './pages/MaterialsLibrary';
import UnderConstruction from './pages/UnderConstruction';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/existing-materials" element={<MaterialsLibrary />} />
          <Route path="/materials/:id" element={<LessonPlanDetails />} />
          <Route path="/annual-plan" element={<AnnualPlanGenerator />} />
          <Route path="/annual-plan/:id" element={<AnnualPlanDetails />} />
          <Route path="/didactic-sequence" element={<DidacticSequenceGenerator />} />
          <Route path="/didactic-sequence/:id" element={<DidacticSequenceDetails />} />
          <Route path="/ activities" element={<UnderConstruction title="Atividades" />} />
          <Route path="/activities/:id" element={<ActivityDetails />} />
          <Route path="/exams" element={<ExamGenerator />} />
          <Route path="/exams/:id" element={<ExamDetails />} />
          <Route path="/student-report" element={<UnderConstruction title="Relatório de Desenvolvimento" />} />
          <Route path="/student-report/:id" element={<StudentReportDetails />} />
        </Route>
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
