// src/handlers/study.handler.js

import { sendMessage } from "../services/telegram.service.js";

function istTime(ts = Date.now()) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata"
  });
}

export async function studyStartHandler(chatId, userId, env, fromButton) {
  const key = `study:${userId}`;
  const existing = await env.KV.get(key);

  if (existing) {
    const data = JSON.parse(existing);
    await sendMessage(
      chatId,
      `⚠️ Study session already running.\n\nStarted at: ${istTime(data.start)}\nElapsed time: 0h 0m\n\nPlease stop the current session before starting a new one.`,
      env
    );
    return;
  }

  const startTime = Date.now();
  await env.KV.put(key, JSON.stringify({ start: startTime }));

  await sendMessage(
    chatId,
    `📚 Study Started\n\nStudy timer started at: ${istTime(startTime)}\nElapsed time: 0m\n\nDefault daily target: 8 hours\n\nStay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env,
    {
      inline_keyboard: [
        [{ text: "⏹️ Stop Study", callback_data: "STOP_STUDY" }]
      ]
    }
  );
}

export async function studyStopHandler(chatId, userId, env) {
  const key = `study:${userId}`;
  const existing = await env.KV.get(key);

  if (!existing) {
    await sendMessage(
      chatId,
      "⚠️ No active study session found.",
      env
    );
    return;
  }

  const data = JSON.parse(existing);
  const stopTime = Date.now();
  const diffMs = stopTime - data.start;
  const totalMin = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;

  await env.KV.delete(key);

  // 🔥 FINAL CONFIRMED MESSAGE (NOT POPUP ONLY)
  await sendMessage(
    chatId,
    `🎯 Daily Target Achieved!\n\nStarted at: ${istTime(data.start)}\nStopped at: ${istTime(stopTime)}\n\nTotal studied today: ${hours}h ${mins}m\n\nExcellent discipline for GPSC Dental Class-2 🏆`,
    env
  );
}
