import { startHandler } from "../handlers/start.handler.js";
import {
  studyMenuHandler,
  studyStartHandler,
  studyStopHandler,
} from "../handlers/study.handler.js";

export async function routeUpdate(update, env) {
  // ---------- MESSAGE ----------
  if (update.message) {
    const msg = update.message;
    const text = msg.text;

    if (text === "/start") {
      return await startHandler(msg, env);
    }

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

    if (cq.data === "STUDY_START") {
      return await studyStartHandler(cq, env);
    }

    if (cq.data === "STUDY_STOP") {
      return await studyStopHandler(cq, env);
    }
  }
}
