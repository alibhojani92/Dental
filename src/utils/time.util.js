const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export function nowTs() {
  return Date.now();
}

export function toIST(ts) {
  return new Date(ts + IST_OFFSET_MS);
}

export function formatTime(ts) {
  const d = toIST(ts);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
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
  return toIST(Date.now()).toISOString().slice(0, 10);
}
