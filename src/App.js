import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dash from "./Dash";
import InternHomePage from "./InternHomePage";
import LoginPage from "./LoginPage";
import Reset from "./Reset";
import Recovery from "./Recovery";
import LeaveManagement from "./LeaveManagement";
import Tasks from "./Tasks";
import Create from "./Create";
import InternHoursCalculator from "./InternHoursCalculator";
import AssetReport from "./AssetReport";
import PerformancePage from "./PerformancePage";
import AdminDashboard from "./AdminDashboard";
import AboutUs from "./AboutUs1";
import ContactUs from "./ContactUs1";
import Settings from "./Settings";
import InternProfile from "./InternProfile";
import InternOnboarding from "./InternOnboarding";
import SimplePaymentPage from "./SimplePaymentPage";
import AssetDashboard from "./AssetDashboard";
import AttendanceDashboard from "./AttendanceDashboard";
import InternDashboard from "./InternDashboard";
import PayrollDashboard from "./PayrollDashboard";
import DocumentsView from "./DocumentView";
import PerformanceFeedbackList from "./PerformanceFeedbackList";
import PerformanceFeedbackPage from "./PerformanceFeedbackPage";
import InternManagement from "./InternManagement";
import RegisterPage from "./RegisterPage";
import InternLists from "./InternLists";
import StaffList from "./StaffList";
import AssetLists from './AssetLists'; // adjust the path as needed
import LeaveList from "./LeaveList";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InternHomePage />} />
        <Route path="/AboutUs1" element={<AboutUs />} />
        <Route path="/ContactUs1" element={<ContactUs />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/loginpage" element={<LoginPage />} />
        <Route path="/Reset" element={<Reset />} />
        <Route path="/Recovery" element={<Recovery />} />
        <Route path="/Dash" element={<Dash />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/Intern-profile" element={<InternProfile />} />
        <Route path="/LeaveManagement" element={<LeaveManagement />} />
        <Route path="/Tasks" element={<Tasks />} />
        <Route path="/Create" element={<Create />} />
        <Route path="/assets" element={<AssetLists />} />
        <Route
          path="/InternHoursCalculator"
          element={<InternHoursCalculator />}
        />
        <Route path="/AssetReport" element={<AssetReport />} />
        <Route path="/PerformancePage" element={<PerformancePage />} />
        <Route path="/InternOnboarding" element={<InternOnboarding />} />
        <Route path="/SimplePaymentPage" element={<SimplePaymentPage />} />
        <Route path="/Intern" element={<InternDashboard />} />
        <Route path="/asset" element={<AssetDashboard />} />
        <Route path="/attendance" element={<AttendanceDashboard />} />
        <Route path="/payroll" element={<PayrollDashboard />} />
        <Route path="/documentsView" element={<DocumentsView />} />
        <Route
          path="/PerformanceFeedbackList"
          element={<PerformanceFeedbackList />}
        />
        <Route
          path="/PerformanceFeedbackPage"
          element={<PerformanceFeedbackPage />}
        />
        <Route path="/InternManagement" element={<InternManagement />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/InternLists" element={<InternLists />} />
        <Route path="/StaffList" element={<StaffList />} />
        <Route path="/LeaveList" element={<LeaveList />} />
      </Routes>
    </Router>
  );
}

export default App;
