export async function sendMessage(
  chatId,
  text,
  env,
  reply_markup = null,
  returnMessage = false
) {
  const res = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        reply_markup,
      }),
    }
  );

  const data = await res.json();

  // 🔒 MUST return message object when asked
  if (returnMessage === true) {
    return data.result;
  }

  return null;
}

export async function editMessage(
  chatId,
  messageId,
  text,
  env,
  reply_markup = null
) {
  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/editMessageText`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text,
        reply_markup,
      }),
    }
  );
}

export async function answerCallback(callbackId, env, text = "") {
  await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackId,
        text,
        show_alert: false,
      }),
    }
  );
}
