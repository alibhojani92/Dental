import { startHandler } from "../handlers/start.handler.js";
import { studyCommandHandler, studyCallbackHandler } from "../handlers/study.handler.js";

export async function routeUpdate(update, env) {
  try {
    // TEXT MESSAGE
    if (update.message) {
      const msg = update.message;
      const text = msg.text || "";

      // /start
      if (text === "/start") {
        return await startHandler(msg, env);
      }

      // /r  OR  /s  (GLOBAL RULE)
      if (text === "/r" || text === "/s") {
        return await studyCommandHandler(msg, env);
      }
    }

    // INLINE CALLBACK
    if (update.callback_query) {
      return await studyCallbackHandler(update.callback_query, env);
    }

    return new Response("OK");
  } catch (err) {
    console.error("ROUTER ERROR:", err);
    return new Response("ERROR", { status: 200 });
  }
}
