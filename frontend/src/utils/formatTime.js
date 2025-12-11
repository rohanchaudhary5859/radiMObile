/**
 * formatTime.js
 * Converts timestamp into "x hours ago" format
 */

export default function formatTime(ts) {
  if (!ts) return "";

  const date = new Date(ts);
  const now = new Date();
  const diff = (now - date) / 1000; // seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;

  return date.toDateString();
}
