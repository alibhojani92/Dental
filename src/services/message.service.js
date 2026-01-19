const API = "https://api.telegram.org/bot";

export async function sendMessage(
  chatId,
  text,
  env,
  reply_markup = null
) {
  await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      reply_markup,
    }),
  });
}

export async function editMessage(
  chatId,
  messageId,
  text,
  env,
  reply_markup = null
) {
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
}

export async function answerCallback(callbackId, env, text = "") {
  await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: callbackId,
      text,
      show_alert: false,
    }),
  });
    }
