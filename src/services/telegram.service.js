const API = "https://api.telegram.org/bot";

export async function sendMessage(chatId, text, env, replyMarkup = null) {
  const payload = {
    chat_id: chatId,
    text,
    reply_markup: replyMarkup,
  };

  await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function answerCallback(id, env) {
  await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: id }),
  });
}
