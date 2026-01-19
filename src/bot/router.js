// src/bot/router.js

import { sendMessage, editMessage, answerCallback } from "../services/telegram.service.js";
import { startStudy, stopStudy } from "../handlers/study.handler.js";
import { buildMainMenu } from "../ui/menus.js";

/**
 * MAIN ROUTER
 */
export async function router(update, env) {
  try {
    console.log("TELEGRAM UPDATE:", JSON.stringify(update));

    /* ---------------- MESSAGE HANDLING ---------------- */
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text?.trim() || "";

      // /start
      if (text === "/start") {
        await sendMessage(
          chatId,
          `Welcome to GPSC Dental Class-2 Preparation Bot 🦷

Your complete companion for:
• Smart study tracking
• Exam-oriented MCQ tests
• Performance analysis
• Consistent preparation

Choose an option below 👇`,
          env,
          buildMainMenu()
        );
        return;
      }

      // /r → start study
      if (text === "/r") {
        await startStudy(chatId, update.message.from.id, env);
        return;
      }

      // /s → stop study
      if (text === "/s") {
        await stopStudy(chatId, update.message.from.id, env);
        return;
      }

      // unknown command
      if (text.startsWith("/")) {
        await sendMessage(
          chatId,
          "❗ Unknown command.\nUse /start to open the menu.",
          env
        );
        return;
      }
    }

    /* ---------------- CALLBACK HANDLING ---------------- */
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const messageId = cb.message.message_id;
      const data = cb.data;

      // remove loading popup
      await answerCallback(cb.id, env);

      /* ----- STUDY ZONE ----- */
      if (data === "MENU_STUDY") {
        await editMessage(
          chatId,
          messageId,
          `📚 *Study Zone*

Use the options below:
• Start Study (/r)
• Stop Study (/s)

Track your preparation consistently 💪`,
          env,
          {
            inline_keyboard: [
              [{ text: "▶️ Start Study", callback_data: "STUDY_START" }],
              [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
              [{ text: "⬅️ Back to Menu", callback_data: "BACK_TO_MENU" }]
            ]
          }
        );
        return;
      }

      if (data === "STUDY_START") {
        await startStudy(chatId, cb.from.id, env);
        return;
      }

      if (data === "STUDY_STOP") {
        await stopStudy(chatId, cb.from.id, env);
        return;
      }

      /* ----- PLACEHOLDER MENUS ----- */
      if (
        data === "MENU_TEST" ||
        data === "MENU_PERFORMANCE" ||
        data === "MENU_REVISION" ||
        data === "MENU_SCHEDULE" ||
        data === "MENU_STREAK" ||
        data === "MENU_SETTINGS" ||
        data === "MENU_ADMIN" ||
        data === "MENU_HELP"
      ) {
        await editMessage(
          chatId,
          messageId,
          "🚧 This feature will be activated in the next phase.\nPlease continue using Study Zone for now.",
          env,
          {
            inline_keyboard: [
              [{ text: "⬅️ Back to Menu", callback_data: "BACK_TO_MENU" }]
            ]
          }
        );
        return;
      }

      /* ----- BACK TO MENU ----- */
      if (data === "BACK_TO_MENU") {
        await editMessage(
          chatId,
          messageId,
          `Choose an option below 👇`,
          env,
          buildMainMenu()
        );
        return;
      }
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err);
  }
}
