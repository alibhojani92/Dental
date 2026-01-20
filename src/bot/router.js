/**
 * CENTRAL ROUTER
 * Phase-1 + Phase-3 SAFE
 */

import { handleCommand } from "./commands.js";
import { handleMenuCallback } from "../handlers/menu.handler.js";
import { handleStudyCallback } from "../handlers/study.handler.js";
import { CALLBACKS } from "../utils/constants.js";

export async function routeUpdate(update, env) {
  try {
    /* ===============================
       TEXT COMMANDS
    ================================ */
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      // ALL commands handled in commands.js
      if (text.startsWith("/")) {
        await handleCommand(text, chatId, env, update.message);
        return;
      }
    }

    /* ===============================
       CALLBACK QUERIES
    ================================ */
    if (update.callback_query) {
      const data = update.callback_query.data;

      // Study buttons
      if (
        data === CALLBACKS.STUDY_START ||
        data === CALLBACKS.STUDY_STOP
      ) {
        await handleStudyCallback(update.callback_query, env);
        return;
      }

      // Phase-1 menus
      await handleMenuCallback(update.callback_query, env);
      return;
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}
