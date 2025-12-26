export default function TaskCard({ image, title, desc, user }) {
  return (
    <div className="task-card">
      {/* Image (safe render) */}
      {image && <img src={image} alt={title} />}

      {/* Content */}
      <div className="task-card-content">
        <h3>{title}</h3>
        <p>{desc}</p>

        <div className="meta">
          📍 Delhi, INDIA &nbsp; ⏱ 38 minutes ago
        </div>

        <div className="footer">
          <div className="avatar"></div>
          <span>{user}</span>
          <button>Request</button>
        </div>
      </div>
    </div>
  );
}
