/**
 * CENTRAL ROUTER – FINAL FIX
 * Phase-3 stable routing
 */

import { handleMenuCallback } from "../handlers/menu.handler.js";
import {
  handleStartStudyCommand,
  handleStopStudyCommand,
  handleStudyCallback,
} from "../handlers/study.handler.js";
import { handleCommand } from "./commands.js";
import { CALLBACKS } from "../utils/constants.js";

export async function routeUpdate(update, env) {
  try {
    /* ===============================
       TEXT MESSAGES
    ================================ */
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      // 🔥 STUDY COMMANDS – DIRECT
      if (text === "/r") {
        await handleStartStudyCommand(update.message, env);
        return;
      }

      if (text === "/s") {
        await handleStopStudyCommand(update.message, env);
        return;
      }

      // Other commands
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

      // 🔥 STUDY CALLBACKS – DIRECT
      if (data === CALLBACKS.STUDY_START || data === CALLBACKS.STUDY_STOP) {
        await handleStudyCallback(update.callback_query, env);
        return;
      }

      // Other menus
      await handleMenuCallback(update.callback_query, env);
      return;
    }

    console.log("UNHANDLED UPDATE", JSON.stringify(update));
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
                            }
