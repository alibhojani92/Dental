const TELEGRAM_API = "https://api.telegram.org/bot";

export async function sendMessage(chatId, text, env, replyMarkup = null) {
  try {
    const payload = {
      chat_id: chatId,
      text: text,
    };

    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    const res = await fetch(
      `${TELEGRAM_API}${env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!data.ok) {
      console.error("sendMessage failed:", JSON.stringify(data));
    }

    return data;
  } catch (err) {
    console.error("sendMessage exception:", err);
  }
}

export async function answerCallback(callbackId, env, text = "") {
  try {
    await fetch(
      `${TELEGRAM_API}${env.BOT_TOKEN}/answerCallbackQuery`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback_query_id: callbackId,
          text,
        }),
      }
    );
  } catch (err) {
    console.error("answerCallback error:", err);
  }
}
