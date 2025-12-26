import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { LoaderProvider, useLoader } from "./context/LoaderContext";
import { setLoader } from "./api";
import "./styles/loader.css";

/* 🔗 Connect Axios → Loader ONCE */
const AppContent = () => {
  const { setLoading } = useLoader();
  setLoader(setLoading);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/otp" element={<OtpVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
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
