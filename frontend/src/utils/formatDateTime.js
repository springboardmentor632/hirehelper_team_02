// src/utils/formatDateTime.js

export const formatDateTimeWithAgo = (date) => {
  if (!date) return "";

  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);

  let ago = "";
  if (diff < 60) ago = "Just now";
  else if (diff < 3600) ago = `${Math.floor(diff / 60)} min ago`;
  else if (diff < 86400) ago = `${Math.floor(diff / 3600)} hr ago`;
  else ago = `${Math.floor(diff / 86400)} day ago`;

  const exact = new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${ago} • ${exact}`;
};
