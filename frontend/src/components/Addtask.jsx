import { useState } from "react";
import "../styles/Addtask.css";
import API from "../api";

const today = new Date().toISOString().split("T")[0];

const Addtask = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    category: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔴 SAFETY CHECK (prevents 400 error)
    if (!formData.startDate || !formData.startTime) {
      alert("Please select start date and time");
      return;
    }

    const startTimeISO = new Date(
      `${formData.startDate}T${formData.startTime}`
    ).toISOString();

    const endTimeISO =
      formData.endDate && formData.endTime
        ? new Date(`${formData.endDate}T${formData.endTime}`).toISOString()
        : null;

    // ✅ MUST use FormData for image upload
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("startTime", startTimeISO);
    data.append("category", formData.category || "General");

    if (endTimeISO) data.append("endTime", endTimeISO);
    if (formData.image) data.append("image", formData.image); // 🔥 IMAGE KEY

    try {
      await API.post("/tasks", data); // ❗ DO NOT set headers manually
      alert("Task created successfully");

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div className="addtask-page">
      {/* Header */}
      <div className="addtask-header">
        <h2>Add New Task</h2>
        <p>Create a task and find someone to help you</p>
      </div>

      {/* Form Card */}
      <div className="addtask-card">
        <form className="addtask-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Help moving furniture"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what help you need..."
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Delhi, India"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                min={today}
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              <option>Household</option>
              <option>Technical</option>
              <option>Cleaning</option>
              <option>Moving</option>
            </select>
          </div>

          <div className="form-group">
            <label>Task Image (Optional)</label>
            <div className="upload-box">
              <span>Upload a file or drag and drop</span>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addtask;
