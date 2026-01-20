import { sendMessage } from "../services/telegram.service.js";

function istNow() {
  return Math.floor(Date.now() / 1000);
}

/* =========================
   STUDY MENU (/r)
========================= */
export async function studyMenuHandler(msg, env) {
  const chatId = msg.chat.id;

  await sendMessage(
    chatId,
    "📚 Study Zone\n\nTrack your daily study time.\nChoose an action 👇",
    env,
    {
      inline_keyboard: [
        [{ text: "▶️ Start Study", callback_data: "STUDY_START" }],
        [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
      ],
    }
  );
}

/* =========================
   START STUDY
========================= */
export async function studyStartHandler(cq, env) {
  const telegramId = cq.from.id;
  const chatId = cq.message.chat.id;

  const active = await env.DB.prepare(
    "SELECT id FROM study_sessions WHERE telegram_id = ? AND end_time IS NULL"
  ).bind(telegramId).first();

  if (active) {
    await sendMessage(chatId, "⚠️ Study already running.", env);
    return;
  }

  await env.DB.prepare(
    "INSERT INTO study_sessions (telegram_id, start_time) VALUES (?, ?)"
  ).bind(telegramId, istNow()).run();

  await sendMessage(chatId, "▶️ Study started successfully.", env);
}

/* =========================
   STOP STUDY
========================= */
export async function studyStopHandler(input, env) {
  const telegramId = input.from.id;
  const chatId = input.message?.chat.id || input.chat.id;

  const session = await env.DB.prepare(
    "SELECT * FROM study_sessions WHERE telegram_id = ? AND end_time IS NULL ORDER BY id DESC LIMIT 1"
  ).bind(telegramId).first();

  if (!session) {
    await sendMessage(chatId, "⚠️ No active study session.", env);
    return;
  }

  const end = istNow();
  const duration = end - session.start_time;

  await env.DB.prepare(
    "UPDATE study_sessions SET end_time = ? WHERE id = ?"
  ).bind(end, session.id).run();

  const mins = Math.floor(duration / 60);

  await sendMessage(
    chatId,
    `🎯 Study Session Saved!\n\n⏱ Duration: ${mins} minutes\nGreat discipline 💪`,
    env
  );
}
