const key = (userId) => `study:active:${userId}`;

export async function getActiveStudy(KV, userId) {
  return KV.get(key(userId), { type: "json" });
}

export async function startStudy(KV, userId, payload) {
  await KV.put(key(userId), JSON.stringify(payload));
}

export async function stopStudy(KV, userId) {
  const data = await KV.get(key(userId), { type: "json" });
  if (!data) return null;

  await KV.delete(key(userId));
  return data;
}
