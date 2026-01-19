const KEY = (uid) => `study:active:${uid}`;

export async function getActiveStudyKV(KV, userId) {
  return KV.get(KEY(userId), { type: "json" });
}

export async function startStudyKV(KV, userId, data) {
  await KV.put(KEY(userId), JSON.stringify(data));
}

export async function stopStudyKV(KV, userId) {
  const data = await KV.get(KEY(userId), { type: "json" });
  if (!data) return null;
  await KV.delete(KEY(userId));
  return data;
}
