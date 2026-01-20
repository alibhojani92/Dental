import { handleCommand } from "./commands.js";
import { handleMenuCallback } from "../handlers/menu.handler.js";

/**
 * Central update router
 * Decides whether update is:
 * - Command (/start, /r, /s, /help)
 * - Inline keyboard callback
 */
export async function routeUpdate(update, env) {
  try {
    /* -----------------------------
       TEXT MESSAGE (COMMANDS)
    ----------------------------- */
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      // Only commands handled here
      if (text.startsWith("/")) {
        await handleCommand(text, chatId, env);
        return;
      }
    }

    /* -----------------------------
       INLINE KEYBOARD CALLBACK
    ----------------------------- */
    if (update.callback_query) {
      await handleMenuCallback(update.callback_query, env);
      return;
    }

    /* -----------------------------
       UNSUPPORTED UPDATE
    ----------------------------- */
    console.log("UNHANDLED UPDATE TYPE");
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}
