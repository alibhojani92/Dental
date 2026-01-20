// src/bot/router.js

import { handleCommand } from "./commands.js";
import { handleMenuCallback } from "../handlers/menu.handler.js";
import {
  startStudyCommand,
  stopStudyCommand,
  studyCallback,
} from "../handlers/study.handler.js";
import { CALLBACKS } from "../utils/constants.js";

export async function routeUpdate(update, env) {
  try {
    /* ===============================
       MESSAGES
    ================================ */
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      if (text === "/r") {
        await startStudyCommand(update.message, env);
        return;
      }

      if (text === "/s") {
        await stopStudyCommand(update.message, env);
        return;
      }

      if (text.startsWith("/")) {
        await handleCommand(text, chatId, env, update.message);
        return;
      }
    }

    /* ===============================
       CALLBACKS
    ================================ */
    if (update.callback_query) {
      const data = update.callback_query.data;

      if (
        data === CALLBACKS.STUDY_START ||
        data === CALLBACKS.STUDY_STOP
      ) {
        await studyCallback(update.callback_query, env);
        return;
      }

      await handleMenuCallback(update.callback_query, env);
      return;
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}
