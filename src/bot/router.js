/**
 * CENTRAL ROUTER
 * Phase-1 UI + Phase-3 Study wiring
 */

import { handleCommand } from "./commands.js";
import { handleMenuCallback } from "../handlers/menu.handler.js";
import {
  handleStartStudyCommand,
  handleStopStudyCommand,
  handleStudyCallback,
} from "../handlers/study.handler.js";
import { CALLBACKS } from "../utils/constants.js";

export async function routeUpdate(update, env) {
  try {
    /* ===============================
       TEXT COMMANDS
    ================================ */
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      // Study shortcuts
      if (text === "/r") {
        await handleStartStudyCommand(update.message, env);
        return;
      }

      if (text === "/s") {
        await handleStopStudyCommand(update.message, env);
        return;
      }

      // Other commands (/start, /help)
      if (text.startsWith("/")) {
        await handleCommand(text, chatId, env);
        return;
      }
    }

    /* ===============================
       INLINE CALLBACKS
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

      // All other menus
      await handleMenuCallback(update.callback_query, env);
      return;
    }

    console.log("UNHANDLED UPDATE TYPE");
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
                                  }
