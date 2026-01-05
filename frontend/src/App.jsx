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

import { LoaderProvider, useLoader } from "./context/LoaderContext";
import { setLoader } from "./api";

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
   SIMPLE LAYOUT (NO SIDEBAR)
========================= */
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <main className="app-content">{children}</main>
    </div>
  );
};

/* =========================
   CONNECT LOADER ONCE
========================= */
const AppContent = () => {
  const { setLoading } = useLoader();

  useEffect(() => {
    setLoader(setLoading);
  }, [setLoading]);

  return (
    <Layout>
      <Routes>
        {/* AUTH ROUTES */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/feed"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-tasks"
          element={
            <PrivateRoute>
              <MyTasks />
            </PrivateRoute>
          }
        />

        <Route
          path="/add-task"
          element={
            <PrivateRoute>
              <Addtask />
            </PrivateRoute>
          }
        />

        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <Request />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/feed" />} />
      </Routes>
    </Layout>
  );
};

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
