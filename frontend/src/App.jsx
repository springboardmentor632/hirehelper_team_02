import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
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
import Sidebar from "./components/Sidebar";

import { LoaderProvider, useLoader } from "./context/LoaderContext";
import { setLoader } from "./api";

import "./styles/loader.css";
import "./styles/layout.css";

/* 🔐 Private Route */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

/* 🔹 Layout (Sidebar fixed, page scrolls) */
const Layout = ({ children }) => {
  const location = useLocation();

  const showSidebar =
    location.pathname === "/feed" ||
    location.pathname === "/my-tasks" ||
    location.pathname === "/add-task";

  return (
    <div className="app-layout">
      {showSidebar && <Sidebar />}
      <main className="app-content">{children}</main>
    </div>
  );
};

/* 🔹 Connect Axios → Loader ONCE */
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

        {/* PROTECTED APP ROUTES */}
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
