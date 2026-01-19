import { sendMessage, answerCallback } from "../services/message.service.js";
import { startReading, stopReading } from "../handlers/study.handler.js";

console.log("ROUTER FILE LOADED");

export default async function router(update, env) {
  try {
    /* ============ COMMANDS ============ */
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const userId = update.message.from.id;
      const text = update.message.text.trim();

      console.log("ROUTER MESSAGE:", text);

      if (text === "/r") {
        await startReading(chatId, userId, env);
        return;
      }

      if (text === "/s") {
        await sendMessage(
          chatId,
          "ℹ️ Use the ⏹️ Stop Study button to stop and save your session.",
          env
        );
        return;
      }

      return;
    }

    /* ============ INLINE CALLBACKS ============ */
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const userId = cb.from.id;
      const data = cb.data;

      console.log("ROUTER CALLBACK:", data);

      if (data === "MENU_STUDY") {
        await answerCallback(cb.id, env);
        await sendMessage(
          chatId,
          `📚 Study Zone

To start studying, type:
/r`,
          env
        );
        return;
      }

      if (data === "STUDY_STOP") {
        await answerCallback(cb.id, env);
        await stopReading(chatId, userId, cb.message.message_id, env);
        return;
      }

      await answerCallback(cb.id, env);
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err?.message || err);
  }
}
