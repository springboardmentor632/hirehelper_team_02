import Sidebar from "./Sidebar";
import "../styles/Addtask.css";

const Addtask = () => {
  return (
    <div className="addtask-page">
      <Sidebar />

      <div className="addtask-content">
        {/* Header */}
        <div className="addtask-header">
          <h2>Add New Task</h2>
          <p>Create a task and find someone to help you</p>
        </div>

        {/* Form Card */}
        <div className="addtask-card">
          <form className="addtask-form">
            <div className="form-group">
              <label>Task Title</label>
              <input type="text" placeholder="e.g. Help moving furniture" />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe what help you need..." />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input type="text" placeholder="e.g. Delhi, India" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>Start Time</label>
                <input type="time" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>End Date </label>
                <input type="date" />
              </div>

              <div className="form-group">
                <label>End Time </label>
                <input type="time" />
              </div>
            </div>

            <div className="form-group">
              <label>Category</label>
              <select>
                <option>Select category</option>
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
                <input type="file" />
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Create Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addtask;
