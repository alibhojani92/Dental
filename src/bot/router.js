import { sendMessage } from "../services/telegram.service.js";
import { startHandler } from "../handlers/start.handler.js";
import {
  startStudy,
  stopStudy,
} from "../handlers/study.handler.js";

export async function router(update, env) {
  try {
    // ===== MESSAGE HANDLING =====
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || "";
      const telegramId = update.message.from.id;

      // /start
      if (text === "/start") {
        await startHandler(chatId, env);
        return;
      }

      // /r → START STUDY
      if (text === "/r") {
        await startStudy({
          chatId,
          telegramId,
          env,
        });
        return;
      }

      // /s → STOP STUDY
      if (text === "/s") {
        await stopStudy({
          chatId,
          telegramId,
          env,
        });
        return;
      }

      // fallback
      await sendMessage(
        chatId,
        "❓ Unknown command.\nUse /r to start study, /s to stop.",
        env
      );
      return;
    }

    // ===== CALLBACK HANDLING =====
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const telegramId = cb.from.id;
      const data = cb.data;

      if (data === "STUDY_START") {
        await startStudy({
          chatId,
          telegramId,
          env,
        });
        return;
      }

      if (data === "STUDY_STOP") {
        await stopStudy({
          chatId,
          telegramId,
          env,
        });
        return;
      }

      await sendMessage(chatId, "⚠️ Invalid action", env);
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
          }
