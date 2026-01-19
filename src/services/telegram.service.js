const API = "https://api.telegram.org/bot";

async function tgFetch(env, method, payload) {
  console.log("TG CALL:", method, JSON.stringify(payload));

  const res = await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  console.log("TG RESPONSE:", method, JSON.stringify(json));

  return json;
}

export async function sendMessage(chatId, text, env, reply_markup = null) {
  return tgFetch(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup,
  });
}

export async function answerCallback(callbackId, env) {
  return tgFetch(env, "answerCallbackQuery", {
    callback_query_id: callbackId,
  });
}
