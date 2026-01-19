import { isValidCallback } from "./validator.js";
import { sendMessage, editMessage } from "../services/message.service.js";
import { startHandler } from "../handlers/start.handler.js";

export async function routeUpdate(update, env) {
  // TEXT
  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    if (text === "/start") {
      await startHandler(chatId, env);
      return;
    }

    await sendMessage(chatId, "Use /start to open the menu.", env);
    return;
  }

  // CALLBACK
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data;

    if (!isValidCallback(data)) {
      await editMessage(chatId, messageId, "⚠️ Invalid action.", env);
      return;
    }

    const placeholders = {
      MENU_STUDY: "📚 Study Zone\n\nFeature will be activated in next phase.",
      MENU_TEST: "📝 Test Zone\n\nFeature will be activated in next phase.",
      MENU_PERFORMANCE: "📊 Performance\n\nFeature will be activated in next phase.",
      MENU_REVISION: "🧠 Revision & Weak Areas\n\nFeature will be activated in next phase.",
      MENU_SCHEDULE: "⏰ Schedule & Target\n\nFeature will be activated in next phase.",
      MENU_STREAK: "🏆 Streak & Rank\n\nFeature will be activated in next phase.",
      MENU_SETTINGS: "⚙️ Settings\n\nFeature will be activated in next phase.",
      MENU_ADMIN: "👮 Admin Panel\n\nRestricted access.",
      MENU_HELP:
        "ℹ️ Help\n\nCommands:\n/start – Main menu\n\nMore features coming soon.",
    };

    await editMessage(
      chatId,
      messageId,
      placeholders[data] || "Coming soon.",
      env
    );
  }
}
