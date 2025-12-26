import { useState } from "react";
import Sidebar from "./Sidebar";
import MyTaskCard from "./MyTaskCard";
import "../styles/MyTasks.css";

const MyTasks = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const myTasks = [
    {
      id: 1,
      title: "Help Moving Furniture",
      category: "Moving",
      status: "Pending",
      description:
        "Need help moving my furniture from my apartment to a new house. Heavy lifting required.",
      location: "Delhi, INDIA",
      time: "38 minutes ago",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      id: 2,
      title: "Help Computer Setup",
      category: "Moving",
      status: "Pending",
      description:
        "Need help to setup my computer system. As it is the setup of computer so I require a person who has well knowledge of computer components.",
      location: "Delhi, INDIA",
      time: "38 minutes ago",
      image:
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
    },
  ];

  return (
    <div className="mytasks-page">
      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar-wrapper ${sidebarOpen ? "open" : ""}`}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="mytasks-content">
        {/* Hamburger (mobile only) */}
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(prev => !prev)}
        >
          ☰
        </button>

        <div className="mytasks-header">
          <h2>My Tasks</h2>
          <p>Manage your posted tasks</p>
        </div>

        <div className="mytasks-grid">
          {myTasks.map(task => (
            <MyTaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyTasks;
