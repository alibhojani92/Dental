const API = "https://api.telegram.org/bot";

export async function sendMessage(chatId, text, env, reply_markup) {
  try {
    await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup,
      }),
    });
  } catch (e) {
    console.error("sendMessage failed", e);
  }
}

export async function editMessage(chatId, messageId, text, env, reply_markup) {
  try {
    await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        reply_markup,
      }),
    });
  } catch (e) {
    console.error("editMessage failed", e);
  }
      }
