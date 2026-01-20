import { sendMessage, answerCallback } from "../services/telegram.service.js";

// ========== COMMAND HANDLER (/r , /s) ==========
export async function studyCommandHandler(message, env) {
  const chatId = message.chat.id;
  const telegramId = message.from.id;

  // Show Study Menu
  return await sendMessage(chatId, {
    text:
      "📚 Study Zone\n\n" +
      "Track your daily study time️ time.\n" +
      "Start & Stop anytime.\n\n" +
      "Choose an action 👇",
    reply_markup: {
      inline_keyboard: [
        [{ text: "▶️ Start Study", callback_data: "STUDY_START" }],
        [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
        [{ text: "⬅️ Back to Main Menu", callback_data: "BACK_TO_MAIN" }],
      ],
    },
  });
}

// ========== CALLBACK HANDLER ==========
export async function studyCallbackHandler(cb, env) {
  const data = cb.data;
  const chatId = cb.message.chat.id;
  const telegramId = cb.from.id;
  const now = Math.floor(Date.now() / 1000);

  // ---- START STUDY ----
  if (data === "STUDY_START") {
    // check active session
    const active = await env.DB.prepare(
      "SELECT id FROM study_sessions WHERE telegram_id = ? AND end_time IS NULL"
    ).bind(telegramId).first();

    if (active) {
      await answerCallback(cb.id, "Study already running");
      return new Response("OK");
    }

    await env.DB.prepare(
      "INSERT INTO study_sessions (telegram_id, start_time) VALUES (?, ?)"
    ).bind(telegramId, now).run();

    await answerCallback(cb.id, "Study started");
    await sendMessage(chatId, {
      text: "▶️ Study Started!\n\nFocus time begins now 💪",
    });
    return new Response("OK");
  }

  // ---- STOP STUDY ----
  if (data === "STUDY_STOP") {
    const session = await env.DB.prepare(
      "SELECT id, start_time FROM study_sessions WHERE telegram_id = ? AND end_time IS NULL ORDER BY id DESC LIMIT 1"
    ).bind(telegramId).first();

    if (!session) {
      await answerCallback(cb.id, "No active study session");
      return new Response("OK");
    }

    const duration = now - session.start_time;

    await env.DB.prepare(
      "UPDATE study_sessions SET end_time = ? WHERE id = ?"
    ).bind(now, session.id).run();

    await answerCallback(cb.id, "Study stopped");
    await sendMessage(chatId, {
      text:
        "⏹️ Study Stopped\n\n" +
        `⏱ Duration: ${Math.floor(duration / 60)} min\n\n` +
        "Great job 👏",
    });
    return new Response("OK");
  }

  // ---- BACK ----
  if (data === "BACK_TO_MAIN") {
    await answerCallback(cb.id);
    await sendMessage(chatId, {
      text: "⬅️ Back to Main Menu\n\nUse /start",
    });
    return new Response("OK");
  }

  return new Response("OK");
                      }
