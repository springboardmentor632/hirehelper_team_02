import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./components/forgot-password";

import Feed from "./components/Feed";
import MyTasks from "./components/MyTasks";
import Addtask from "./components/Addtask";
import Request from "./components/Request";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/otp" element={<OtpVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/add-task" element={<Addtask />} />
        <Route path="/requests" element={<Request />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;