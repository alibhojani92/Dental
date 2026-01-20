// src/handlers/study.handler.js

import { nowIST, formatIST } from "../utils/time.js";
import { sendMessage } from "../services/telegram.service.js";

export async function startStudy(env, chatId, user) {
  // Check running session
  const existing = await env.DB.prepare(
    `SELECT * FROM reading_sessions 
     WHERE telegram_id = ? AND end_time IS NULL`
  ).bind(user.telegram_id).first();

  if (existing) {
    await sendMessage(env, chatId,
      `⚠️ Study session already running.\n\nStarted at: ${formatIST(new Date(existing.start_time))}`
    );
    return;
  }

  const start = nowIST();

  await env.DB.prepare(
    `INSERT INTO reading_sessions (telegram_id, start_time)
     VALUES (?, ?)`
  ).bind(user.telegram_id, start.toISOString()).run();

  await sendMessage(
    env,
    chatId,
    `📚 Study Started\n\nStarted at: ${formatIST(start)}\n\nStay focused — every minute counts for GPSC Dental Class-2 🦷`
  );
}

export async function stopStudy(env, chatId, user) {
  const session = await env.DB.prepare(
    `SELECT * FROM reading_sessions 
     WHERE telegram_id = ? AND end_time IS NULL
     ORDER BY start_time DESC LIMIT 1`
  ).bind(user.telegram_id).first();

  if (!session) {
    await sendMessage(env, chatId, "⚠️ No active study session found.");
    return;
  }

  const end = nowIST();

  await env.DB.prepare(
    `UPDATE reading_sessions 
     SET end_time = ? 
     WHERE id = ?`
  ).bind(end.toISOString(), session.id).run();

  const diffMs = end - new Date(session.start_time);
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;

  await sendMessage(
    env,
    chatId,
`🎯 Study Session Saved!

Started at: ${formatIST(new Date(session.start_time))}
Stopped at: ${formatIST(end)}

Total studied today: ${hrs}h ${remMins}m

Excellent discipline for GPSC Dental Class-2 🏆`
  );
    }
