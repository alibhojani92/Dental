import { isValidCallback } from "./validator.js";
import { sendMessage, editMessage } from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";
import { MESSAGES } from "./messages.js";

export async function routeUpdate(update, env) {
  // TEXT
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    await sendMessage(chatId, MESSAGES.USE_START, env);
    return;
  }

  // CALLBACK
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data;

    if (!isValidCallback(data)) {
      await editMessage(chatId, messageId, MESSAGES.INVALID_ACTION, env);
      return;
    }

    const reply =
      MESSAGES.PLACEHOLDERS[data] ||
      "Feature will be activated in next phase.";

    await editMessage(chatId, messageId, reply, env);
  }
        }
