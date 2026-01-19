import { answerCallback } from "../services/message.service.js";
import {
  studyStartHandler,
  studyStopHandler,
} from "../handlers/study.handler.js";
import { startHandler } from "../handlers/start.handler.js";
import { sendMessage } from "../services/message.service.js";
import { MESSAGES } from "./messages.js";

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
    const userId = cb.from.id;
    const data = cb.data;

    if (data === "MENU_STUDY") {
      await answerCallback(cb.id, env, "📚 Study started");
      await studyStartHandler(chatId, userId, env);
      return;
    }

    if (data === "STUDY_STOP") {
      await answerCallback(cb.id, env, "⏹️ Study saved");
      await studyStopHandler(chatId, userId, env);
      return;
    }
  }
  }
