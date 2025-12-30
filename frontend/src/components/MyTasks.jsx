import { useEffect, useState } from "react";
import "../styles/myTasks.css";
import MyTaskCard from "./MyTaskCard";
import API from "../api";

const MyTasks = () => {
  const [myTasks, setMyTasks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const res = await API.get("/tasks/my");

        // 🔥 SAFE HANDLING FOR BOTH RESPONSE TYPES
        const tasks = Array.isArray(res.data)
          ? res.data
          : res.data.tasks;

        setMyTasks(tasks || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load tasks");
      }
    };

    fetchMyTasks();
  }, []);

  return (
    <div className="mytasks-scope">
      <div className="mytasks-header">
        <h2>My Tasks</h2>
        <p>Manage your posted tasks</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="mytasks-grid">
        {myTasks.length === 0 ? (
          <p>No tasks created yet</p>
        ) : (
          myTasks.map((task) => (
            <MyTaskCard
              key={task._id}
              task={{
                id: task._id,
                title: task.title,
                category: task.category,
                status: task.status || "Open",
                description: task.description,
                location: task.location,
                startTime: task.startTime,
                endTime: task.endTime,
                image: task.image,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyTasks;
