import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import Feed from "./components/Feed";
import MyTasks from "./components/MyTasks";
import Addtask from "./components/Addtask";
import Request from "./components/Request";
import MyRequests from "./components/MyRequests";
import Settings from "./components/Settings";

import Sidebar from "./components/Sidebar";

import { LoaderProvider, useLoader } from "./context/LoaderContext";
import { setLoader } from "./api";
import API from "./api";

import "./styles/loader.css";
import "./styles/layout.css";

/* =========================
   PRIVATE ROUTE
========================= */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

/* =========================
   AUTH LAYOUT
========================= */
// const AuthLayout = ({ children }) => <>{children}</>;
const AuthLayout = ({ children }) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // If already logged in → block auth pages
  if (token) {
    return <Navigate to="/feed" replace />;
  }

  return <>{children}</>;
};

/* =========================
   DASHBOARD LAYOUT
========================= */
const DashboardLayout = ({ children }) => {
  return (
    <div className="app-layout">
      {children}
    </div>
  );
};


/* =========================
   APP CONTENT
========================= */
const AppContent = () => {
  const { setLoading } = useLoader();

  /* 🔥 Connect loader once */
  useEffect(() => {
    setLoader(setLoading);
  }, [setLoading]);

  /* 🔥 ALWAYS refresh logged-in user from backend */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await API.get("/auth/me");

        localStorage.setItem("user", JSON.stringify(res.data));
        window.dispatchEvent(new Event("profileUpdated"));
      } catch (err) {
        console.log("User not logged in");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    loadUser();
  }, []);

  return (
    <Routes>
      {/* AUTH ROUTES */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
      <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
      <Route path="/otp" element={<AuthLayout><OtpVerification /></AuthLayout>} />
      <Route path="/forgot-password" element={<AuthLayout><ForgotPassword /></AuthLayout>} />
      <Route path="/reset-password" element={<AuthLayout><ResetPassword /></AuthLayout>} />

      {/* DASHBOARD ROUTES */}
      <Route path="/feed" element={<PrivateRoute><DashboardLayout><Feed /></DashboardLayout></PrivateRoute>} />
      <Route path="/my-tasks" element={<PrivateRoute><DashboardLayout><MyTasks /></DashboardLayout></PrivateRoute>} />
      <Route path="/add-task" element={<PrivateRoute><DashboardLayout><Addtask /></DashboardLayout></PrivateRoute>} />
      <Route path="/requests" element={<PrivateRoute><DashboardLayout><Request /></DashboardLayout></PrivateRoute>} />
      <Route path="/my-requests" element={<PrivateRoute><DashboardLayout><MyRequests /></DashboardLayout></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><DashboardLayout><Settings /></DashboardLayout></PrivateRoute>} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/feed" />} />
    </Routes>
  );
};

/* =========================
   ROOT
========================= */
function App() {
  return (
    <LoaderProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoaderProvider>
  );
}

export default App;
