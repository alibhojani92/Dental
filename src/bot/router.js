import { startHandler } from "../handlers/start.handler.js";
import { studyMenuHandler, studyStartHandler, studyStopHandler } from "../handlers/study.handler.js";

export async function routeUpdate(update, env) {
  try {
    // ---------- MESSAGE ----------
    if (update.message) {
      const msg = update.message;
      const text = msg.text || "";
      const chatId = msg.chat.id;

      // 🔒 Phase-1 START (DO NOT TOUCH)
      if (text === "/start") {
        return await startHandler(msg, env);
      }

      // Phase-3 commands
      if (text === "/r") {
        return await studyMenuHandler(msg, env);
      }

      if (text === "/s") {
        return await studyStopHandler(msg, env);
      }
    }

    // ---------- CALLBACK ----------
    if (update.callback_query) {
      const cq = update.callback_query;
      const data = cq.data;
      const msg = cq.message;

      if (data === "STUDY_START") {
        return await studyStartHandler(cq, env);
      }

      if (data === "STUDY_STOP") {
        return await studyStopHandler(cq, env);
      }
    }

  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
          }
