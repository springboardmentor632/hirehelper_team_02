export default function TaskCard({ image, title, desc, user }) {
  return (
    <div className="task-card">
      <img src={image} alt="" />
      <h3>{title}</h3>
      <p>{desc}</p>

      <div className="meta">
        📍 Delhi, INDIA &nbsp; ⏱ 38 minutes ago
      </div>

      <div className="footer">
        <div className="avatar"></div>
        <span>{user}</span>
        <button>Request Sent</button>
      </div>
    </div>
  );
}
