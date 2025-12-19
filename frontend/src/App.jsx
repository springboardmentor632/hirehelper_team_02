import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OtpVerification from "./components/OtpVerification";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpVerification />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
