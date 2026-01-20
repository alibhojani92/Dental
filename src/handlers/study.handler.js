import { sendMessage } from "../services/telegram.service.js";
import { nowIST } from "../utils/time.js";

function stopKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "⏹ Stop Study", callback_data: "STUDY_STOP" }],
    ],
  };
}

// ================= START STUDY =================
export async function startStudy({ chatId, telegramId, env }) {
  console.log("START STUDY HANDLER HIT", telegramId);

  const startTime = nowIST();

  // check active session
  const active = await env.DB.prepare(
    `SELECT * FROM reading_sessions 
     WHERE telegram_id = ? AND end_time IS NULL`
  )
    .bind(telegramId)
    .first();

  if (!active) {
    await env.DB.prepare(
      `INSERT INTO reading_sessions 
       (telegram_id, start_time) VALUES (?, ?)`
    )
      .bind(telegramId, startTime)
      .run();
  }

  // ✅ REPLY MUST ALWAYS COME
  await sendMessage(
    chatId,
    `📖 Study Started

⏱️ Start Time: ${startTime}

Focus mode ON 🔥`,
    env,
    stopKeyboard()
  );
}

// ================= STOP STUDY =================
export async function stopStudy({ chatId, telegramId, env }) {
  console.log("STOP STUDY HANDLER HIT", telegramId);

  const session = await env.DB.prepare(
    `SELECT * FROM reading_sessions 
     WHERE telegram_id = ? AND end_time IS NULL
     ORDER BY start_time DESC LIMIT 1`
  )
    .bind(telegramId)
    .first();

  if (!session) {
    await sendMessage(
      chatId,
      "⚠️ No active study session found.",
      env
    );
    return;
  }

  const endTime = nowIST();

  await env.DB.prepare(
    `UPDATE reading_sessions 
     SET end_time = ? WHERE id = ?`
  )
    .bind(endTime, session.id)
    .run();

  // duration calc (minutes)
  const start = new Date(session.start_time);
  const end = new Date(endTime);
  const diffMin = Math.floor((end - start) / 60000);
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;

  // ✅ FINAL CONFIRMATION MESSAGE (NO POPUP ONLY)
  await sendMessage(
    chatId,
    `🎯 Study Session Completed!

Started at: ${session.start_time}
Stopped at: ${endTime}

Total studied: ${h}h ${m}m

Excellent discipline for GPSC Dental Class-2 🏆`,
    env
  );
}
