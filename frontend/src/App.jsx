import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import Hospitals from "./pages/admin/Hospitals";
import Doctors from "./pages/admin/Doctors";
import Medicines from "./pages/admin/Medicines";
import Patients from "./pages/admin/Patients";

// Doctor pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import Prescription from "./pages/doctor/Prescription";

// Layout & Route Guard
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/Layout";
import PrescriptionsList from "./pages/doctor/ PrescriptionsList";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTE ================= */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/hospitals"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <Hospitals />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/Doctors"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <Doctors />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/Medicines"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <Medicines />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/Patients"
          element={
            <ProtectedRoute role="admin">
              <Layout>
                <Patients />
              </Layout>
            </ProtectedRoute>
          }
        />

       {/* ================= DOCTOR ROUTES ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescription/:patientId"
          element={
            <ProtectedRoute role="doctor">
              <Layout>
                <Prescription />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/prescriptions"
          element={
            <ProtectedRoute role="doctor">
              <Layout>
                <PrescriptionsList />
              </Layout>
            </ProtectedRoute>
          }
        />
        

        {/* ================= FALLBACK ================= */}
        <Route
          path="*"
          element={
            <div className="h-screen flex items-center justify-center text-gray-600">
              404 | Page Not Found
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
