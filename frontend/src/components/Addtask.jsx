import { useState } from "react";
import Sidebar from "./Sidebar";
import Notification from "./Notification";
import "../styles/Addtask.css";
import API from "../api";
import { useNavigate } from "react-router-dom";

const today = new Date().toISOString().split("T")[0];
const MAX_FILE_SIZE = 500 * 1024; // 500KB

const AddTask = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  /* =========================
     FILE HANDLER
  ========================= */
  const handleFile = (file) => {
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      alert("Only JPG and PNG files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 500KB");
      return;
    }

    setImage(file);
  };

  /* =========================
     CREATE TASK
  ========================= */
  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("startDate", startDate);
      formData.append("startTime", startTime);
      formData.append("endDate", endDate);
      formData.append("endTime", endTime);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      const token = localStorage.getItem("token");

      await API.post("/tasks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Task created successfully");
      navigate("/my-tasks");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };
    const handleCancel = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setStartDate("");
    setStartTime("");
    setEndDate("");
    setEndTime("");
    setCategory("");
    setImage(null);
  };


  return (
    <div className="addtask-page">
      {/* Sidebar overlay (mobile only) */}
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
      <div className="addtask-content">
        {/* Hamburger (mobile only) */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Header */}
        <div className="addtask-header">
          <div className="header-left">
            <h2>Add New Task</h2>
            <p>Create a task and find someone to help you</p>
          </div>
          <Notification />
        </div>

        {/* Form card */}
        <div className="addtask-card">
          <form className="addtask-form" onSubmit={handleCreateTask}>
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  min={today}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                <option value="Cooking">Cooking</option>
                <option value="Gardening">Gardening</option>
                <option value="Household">Household</option>
                <option value="Technical">Technical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Moving">Moving</option>
              </select>
            </div>

            <div className="form-group">
              <label>Task Image (Optional)</label>

              <div
                className="upload-box"
                onClick={() =>
                  document.getElementById("task-image-input").click()
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files[0]);
                }}
              >
                <div className="upload-content">
                  <div className="upload-icon">📤</div>
                  <p>
                    <strong>Drag & drop</strong> your files here or
                  </p>
                  <span className="upload-btn">Choose files</span>
                  <p className="upload-hint">
                    Only JPG and PNG files. Max size 500KB.
                  </p>
                </div>

                <input
                  id="task-image-input"
                  type="file"
                  name="image"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>

              {image && (
                <p className="upload-selected">
                  Selected file: <strong>{image.name}</strong>
                </p>
              )}
            </div>

            <div className="btn-wrapper">
            <button type="submit" className="submit-btn">
              Create Task
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              Cancel
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
