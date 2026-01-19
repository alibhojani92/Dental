// src/bot/router.js

import { sendMessage, editMessage, answerCallback } from "../services/telegram.service.js";
import { startHandler } from "../handlers/start.handler.js";
import {
  studyStartHandler,
  studyStopHandler,
} from "../handlers/study.handler.js";

// DEBUG (keep during verification)
console.log("ROUTER FILE LOADED");

export default async function router(update, env) {
  try {
    /* ================== CALLBACKS ================== */
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const userId = cb.from.id;
      const data = cb.data;

      console.log("ROUTER CALLBACK:", data);
      await answerCallback(cb.id, env);

      if (data === "MENU_STUDY") {
        await editMessage(
          chatId,
          messageId,
          `📚 *Study Zone*

To start studying, type:
/r

Use the button below to stop an active session.`,
          env,
          {
            inline_keyboard: [
              [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
              [{ text: "⬅️ Back to Menu", callback_data: "BACK_TO_MENU" }],
            ],
          }
        );
        return;
      }

      if (data === "STUDY_STOP") {
        await studyStopHandler(chatId, userId, env);
        return;
      }

      if (data === "BACK_TO_MENU") {
        await startHandler(chatId, env);
        return;
      }

      return;
    }

    /* ================== MESSAGES ================== */
    if (!update.message || !update.message.text) return;

    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = update.message.text.trim();

    console.log("ROUTER MESSAGE:", text);

    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    if (text === "/r") {
      await studyStartHandler(chatId, userId, env);
      return;
    }

    if (text === "/s") {
      await studyStopHandler(chatId, userId, env);
      return;
    }

    if (text.startsWith("/")) {
      await sendMessage(chatId, "❓ Unknown command. Use /start.", env);
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err?.message || err, err?.stack);
  }
}
