// src/bot/router.js

import { sendMessage, editMessage, answerCallback } from "../services/telegram.service.js";
import { startHandler } from "../handlers/start.handler.js";
import { studyStartHandler, studyStopHandler } from "../handlers/study.handler.js";
import { MESSAGES } from "./messages.js";

export async function router(update, env) {
  try {
    // ====== CALLBACK QUERY ======
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const data = cb.data;
      const userId = cb.from.id;

      // always answer callback (popup)
      await answerCallback(cb.id, env);

      if (data === "MENU_STUDY") {
        await studyStartHandler(chatId, userId, env, true);
        return;
      }

      if (data === "STOP_STUDY") {
        await studyStopHandler(chatId, userId, env);
        return;
      }

      await editMessage(
        chatId,
        messageId,
        "⚠️ Invalid action.",
        env
      );
      return;
    }

    // ====== MESSAGE ======
    if (!update.message || !update.message.text) return;

    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = update.message.text.trim();

    // ---- COMMANDS ----
    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    if (text === "/r") {
      await studyStartHandler(chatId, userId, env, false);
      return;
    }

    if (text === "/s") {
      await studyStopHandler(chatId, userId, env);
      return;
    }

    // fallback
    await sendMessage(
      chatId,
      "❓ Unknown command. Use /start",
      env
    );
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
        }
