import "../styles/FeedTaskCard.css";

export default function FeedTaskCard({ task }) {
  return (
    <div className="feed-card">
     {task.image && (
  <img
    src={task.image}
    alt={task.title}
    className="feed-card-image"
  />
)}


      <div className="feed-card-body">
        <span className="feed-tag">{task.category || "General"}</span>

        <h4 className="feed-title">{task.title}</h4>
        <p className="feed-desc">{task.description}</p>

        <div className="feed-meta">
          <span>📍 {task.location}</span>
          <span>
            ⏰{" "}
            {new Date(task.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(task.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="feed-footer">
          <span className="feed-user">
            {task.createdBy?.firstName || "User"}
          </span>
          <button className="feed-request-btn">Request</button>
        </div>
      </div>
    </div>
  );
}
