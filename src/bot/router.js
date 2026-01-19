// src/services/telegram.service.js

const API = "https://api.telegram.org/bot";

async function tgFetch(env, method, payload) {
  const res = await fetch(`${API}${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendMessage(chatId, text, env, reply_markup = null) {
  return tgFetch(env, "sendMessage", {
    chat_id: chatId,
    text,
    reply_markup,
    parse_mode: "Markdown",
  });
}

export async function editMessage(chatId, messageId, text, env, reply_markup = null) {
  return tgFetch(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    reply_markup,
    parse_mode: "Markdown",
  });
}

export async function answerCallback(callbackId, env, text = "") {
  return tgFetch(env, "answerCallbackQuery", {
    callback_query_id: callbackId,
    text,
    show_alert: false,
  });
    }
