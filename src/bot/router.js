import { answerCallback, sendMessage } from "../services/message.service.js";
import { startReading, stopReading } from "../handlers/study.handler.js";
import { startHandler } from "../handlers/start.handler.js";
import { MESSAGES } from "./messages.js";

export async function routeUpdate(update, env) {
  // TEXT / COMMANDS
  if (update.message) {
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = (update.message.text || "").trim();

    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    if (text === "/r") {
      await startReading(chatId, userId, env);
      return;
    }

    if (text === "/s") {
      // If user types /s without pressing button, we can’t know messageId.
      // Send info if nothing active; otherwise user should use ⏹️ button.
      await sendMessage(
        chatId,
        `ℹ️ Use the ⏹️ Stop Study button to stop and save your session.`,
        env
      );
      return;
    }

    await sendMessage(chatId, MESSAGES.USE_START, env);
    return;
  }

  // INLINE CALLBACKS
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const userId = cb.from.id;

    // 📚 Study Zone = instruction only (no state change)
    if (cb.data === "MENU_STUDY") {
      await answerCallback(cb.id, env);
      await sendMessage(
        chatId,
        `📚 Study Zone

To start studying, type:
/r

Stay focused — every minute counts for GPSC Dental Class-2 🦷`,
        env
      );
      return;
    }

    // ⏹️ Stop Study
    if (cb.data === "STUDY_STOP") {
      await answerCallback(cb.id, env);
      await stopReading(chatId, userId, cb.message.message_id, env);
      return;
    }

    await answerCallback(cb.id, env);
  }
}
