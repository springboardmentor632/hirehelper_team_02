import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/sidebar.css";
import {
  FiHome,
  FiCheckSquare,
  FiInbox,
  FiFileText,
  FiPlusCircle,
  FiSettings,
  FiSearch,
  FiLogOut,
} from "react-icons/fi";
import logoImage from "../assets/logo.png";

export default function Sidebar() {
  const navigate = useNavigate();

  /* =========================
     USER STATE (LIVE SYNC)
  ========================= */
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  useEffect(() => {
    const refreshUser = () => {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setUser(u);
    };

    window.addEventListener("storage", refreshUser);
    window.addEventListener("profileUpdated", refreshUser);

    return () => {
      window.removeEventListener("storage", refreshUser);
      window.removeEventListener("profileUpdated", refreshUser);
    };
  }, []);

  const fullName =
    user.firstName || user.lastName
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "User";

  const avatar = user.profileImage || "";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      {/* HEADER */}
      <div className="sidebar-header">
        <img src={logoImage} alt="HireHelper Logo" className="logo-circle" />
        <div>
          {/* <h2>HireHelper</h2> */}
          <h1>HireHelper</h1>
          <p>Get a helping partner</p>
        </div>
      </div>
      <hr />
      {/* SEARCH */}
      {/* <div className="sidebar-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div> */}

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <NavItem to="/feed" label="Feed" icon={FiHome} />
        <NavItem to="/my-tasks" label="My Tasks" icon={FiCheckSquare} />
        <NavItem to="/requests" label="Requests" icon={FiInbox} />
        <NavItem to="/my-requests" label="My Requests" icon={FiFileText} />
        <NavItem to="/add-task" label="Add Task" icon={FiPlusCircle} />
        <NavItem to="/settings" label="Settings" icon={FiSettings} />
      </nav>

      {/* USER PROFILE + LOGOUT */}
      <div className="sidebar-footer">
        <div className="sidebar-profile">
          <div className="profile-avatar">
            {avatar ? (
              <img src={avatar} alt="profile" />
            ) : (
              fullName.charAt(0).toUpperCase()
            )}
          </div>

          <div className="profile-info">
            <div className="profile-name">{fullName}</div>
            <div className="profile-email">{user.email || ""}</div>
          </div>

          <button className="profile-logout" onClick={handleLogout}>
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* NAV ITEM */
function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "sidebar-link active" : "sidebar-link"
      }
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
}
