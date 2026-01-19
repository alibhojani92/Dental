import { answerCallback, sendMessage } from "../services/message.service.js";
import { startReading, stopReading } from "../handlers/study.handler.js";
import { startHandler } from "../handlers/start.handler.js";
import { MESSAGES } from "./messages.js";

export async function routeUpdate(update, env) {
  /* =========================
     TEXT / COMMAND HANDLING
     ========================= */
  if (update.message) {
    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = (update.message.text || "").trim();

    // /start
    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    // /r → start reading
    if (text === "/r") {
      await startReading(chatId, userId, env);
      return;
    }

    // /s → stop reading (instruction only)
    if (text === "/s") {
      await sendMessage(
        chatId,
        `ℹ️ Use the ⏹️ Stop Study button to stop and save your session.`,
        env
      );
      return;
    }

    // Fallback (ONLY if nothing matched)
    await sendMessage(chatId, MESSAGES.USE_START, env);
    return;
  }

  /* =========================
     INLINE CALLBACK HANDLING
     ========================= */
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const userId = cb.from.id;
    const data = cb.data;

    // 📚 Study Zone → instruction only
    if (data === "MENU_STUDY") {
      await answerCallback(cb.id, env); // no popup text
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
    if (data === "STUDY_STOP") {
      await answerCallback(cb.id, env); // no popup text
      await stopReading(chatId, userId, cb.message.message_id, env);
      return;
    }

    // Unknown callback → just acknowledge
    await answerCallback(cb.id, env);
    return;
  }
        }
