/**
 * CENTRAL ROUTER
 * Phase-1 + Phase-3 (OPTION-A)
 * Phase-1 & Phase-2 untouched
 */

import { handleCommand } from "./commands.js";
import { handleMenuCallback } from "../handlers/menu.handler.js";
import {
  handleStartStudyCommand,
  handleStopStudyCommand,
  handleStudyCallback,
} from "../handlers/study.handler.js";
import { CALLBACKS } from "../utils/constants.js";

/**
 * Named export — Phase-1 contract
 */
export async function routeUpdate(update, env) {
  try {
    /* ===============================
       TEXT MESSAGES
    ================================ */
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      // Phase-3 study shortcuts
      if (text === "/r") {
        await handleStartStudyCommand(update.message, env);
        return;
      }

      if (text === "/s") {
        await handleStopStudyCommand(update.message, env);
        return;
      }

      // Phase-1 command flow (/start, /help, etc.)
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

      // Phase-3 study buttons
      if (
        data === CALLBACKS.STUDY_START ||
        data === CALLBACKS.STUDY_STOP
      ) {
        await handleStudyCallback(update.callback_query, env);
        return;
      }

      // Phase-1 menu buttons
      await handleMenuCallback(update.callback_query, env);
      return;
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
        }
