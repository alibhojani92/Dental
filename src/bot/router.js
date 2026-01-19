import { isValidCallback } from "./validator.js";
import {
  sendMessage,
  editMessage,
  answerCallback,
} from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";
import { MESSAGES } from "./messages.js";
import {
  studyStartHandler,
  studyStopHandler,
} from "../handlers/study.handler.js";

export async function routeUpdate(update, env) {
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

  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data;
    const userId = cb.from.id;

    await answerCallback(cb.id, env);

    if (data === "MENU_STUDY") {
      await studyStartHandler(chatId, userId, env);
      return;
    }

    if (data === "STUDY_STOP") {
      await studyStopHandler(chatId, messageId, userId, env);
      return;
    }

    if (!isValidCallback(data)) {
      await editMessage(chatId, messageId, MESSAGES.INVALID_ACTION, env);
      return;
    }

    await editMessage(
      chatId,
      messageId,
      MESSAGES.PLACEHOLDERS[data],
      env
    );
  }
}
