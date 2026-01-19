import { nowTs } from "../utils/time.util.js";

const KEY = (uid) => `study:active:${uid}`;

export async function startStudyKV(KV, userId) {
  const key = KEY(userId);
  const existing = await KV.get(key, { type: "json" });
  if (existing) return { already: true, data: existing };

  const payload = { startTs: nowTs() };
  await KV.put(key, JSON.stringify(payload));
  return { already: false, data: payload };
}

export async function getActiveStudyKV(KV, userId) {
  return KV.get(KEY(userId), { type: "json" });
}

export async function stopStudyKV(KV, userId) {
  const key = KEY(userId);
  const data = await KV.get(key, { type: "json" });
  if (!data) return null;
  await KV.delete(key);
  return data;
}
