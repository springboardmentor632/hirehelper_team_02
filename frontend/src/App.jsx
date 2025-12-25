// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./components/LoginPage";
// import SignupPage from "./components/SignupPage";
// import OtpVerification from "./components/OtpVerification";
// import ForgotPassword from "./components/forgot-password";
// import Feed from "./components/Feed";
// import Addtask from "./components/Addtask"; 
 
 
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/otp" element={<OtpVerification />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/feed" element={<Feed />} />
//         <Route path="/Add-task" element={<Addtask />} />
//       </Routes>
//     </BrowserRouter>
//   );
 
// }
 
// export default App;





import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import OtpVerification from "./components/OtpVerification";
import ForgotPassword from "./components/forgot-password";

import Feed from "./components/Feed";
import MyTasks from "./components/MyTasks";
import Sidebar from "./components/Sidebar";
import Addtask from "./components/Addtask";

/* 🔹 Wrapper to control Sidebar visibility */
function Layout({ children }) {
  const location = useLocation();

  const showSidebar =
    location.pathname === "/feed" ||
    location.pathname === "/my-tasks";

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/feed" element={<Feed />} />
          <Route path="/my-tasks" element={<MyTasks />} />
          <Route path="/add-task" element={<Addtask />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
