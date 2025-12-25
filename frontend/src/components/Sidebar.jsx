import { NavLink, useNavigate } from "react-router-dom";
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
  FiUser,
} from "react-icons/fi";
import logoImage from '../assets/logo.png'; // Import the logo image

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real application, this would also clear user session/auth tokens.
    navigate('/');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <img src={logoImage} alt="HireHelper Logo" className="logo-circle" />
        <div>
          <h2>HireHelper</h2>
          <p>Get a helping partner</p>
        </div>
      </div>

      {/* Search */}
      <div className="sidebar-search">
        <FiSearch className="search-icon" />
        <input type="text" placeholder="Search" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavItem to="/feed" label="Feed" />
        <NavItem to="/my-tasks" label="My Tasks" />
        <NavItem to="/requests" label="Requests" />
        <NavItem to="/my-requests" label="My Requests" />
        <NavItem to="/add-task" label="Add Task" />
        <NavItem to="/settings" label="Settings" />
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>↩ Log out</button>
      </div>
    </aside>
  );
}

/* Reusable Nav Item */
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? "sidebar-link active" : "sidebar-link"
      }
    >
      {label}
    </NavLink>
  );
}
