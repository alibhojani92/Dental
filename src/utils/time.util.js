export function nowTs() {
  return Date.now();
}

export function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function diffMinutes(startTs, endTs) {
  return Math.max(0, Math.floor((endTs - startTs) / 60000));
}

export function formatHM(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
