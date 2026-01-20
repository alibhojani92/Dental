/**
 * TELEGRAM SERVICE
 * Phase-1: sendMessage + answerCallback
 * Single point of Telegram API interaction
 */

const TELEGRAM_API = "https://api.telegram.org/bot";

/* ===============================
   SEND MESSAGE
================================ */
export async function sendMessage(chatId, text, env, replyMarkup = null) {
  try {
    const payload = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const res = await fetch(
      `${TELEGRAM_API}${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("sendMessage failed:", errText);
    }
  } catch (err) {
    console.error("TELEGRAM sendMessage ERROR:", err);
  }
}

/* ===============================
   ANSWER CALLBACK QUERY
================================ */
export async function answerCallback(callbackQueryId, env, text = "") {
  try {
    const payload = {
      callback_query_id: callbackQueryId,
    };

    // Optional popup text (empty by default)
    if (text) {
      payload.text = text;
      payload.show_alert = false;
    }

    const res = await fetch(
      `${TELEGRAM_API}${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("answerCallback failed:", errText);
    }
  } catch (err) {
    console.error("TELEGRAM answerCallback ERROR:", err);
  }
      }
