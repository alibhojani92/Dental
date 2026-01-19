// src/bot/router.js

import { sendMessage, answerCallback } from "../services/telegram.service.js";
import { startHandler } from "../handlers/start.handler.js";
import {
  studyStartHandler,
  studyStopHandler,
} from "../handlers/study.handler.js";

console.log("ROUTER FILE LOADED");

export default async function router(update, env) {
  try {
    /* ================== CALLBACKS ================== */
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const userId = cb.from.id;
      const data = cb.data;

      console.log("CALLBACK RECEIVED:", data);

      // always answer callback (popup)
      await answerCallback(cb.id, env);

      if (data === "MENU_STUDY") {
        console.log("MENU_STUDY HIT");
        await sendMessage(
          chatId,
          `Study Zone

To start studying, type:
/r

Use the Stop Study button to finish your session.`,
          env,
          {
            inline_keyboard: [
              [{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }],
              [{ text: "⬅️ Back to Menu", callback_data: "BACK_TO_MENU" }],
            ],
          }
        );
        return;
      }

      if (data === "STUDY_STOP") {
        console.log("STUDY_STOP CALLBACK HIT");

        const msg = await studyStopHandler(userId, env);
        console.log("STUDY_STOP MESSAGE FROM HANDLER:", msg);

        // 🔥 FORCE MESSAGE (diagnostic)
        await sendMessage(chatId, "DEBUG: STOP REACHED", env);

        if (msg) {
          await sendMessage(chatId, msg, env);
        }
        return;
      }

      if (data === "BACK_TO_MENU") {
        console.log("BACK_TO_MENU HIT");
        await startHandler(chatId, env);
        return;
      }

      console.log("UNKNOWN CALLBACK:", data);
      return;
    }

    /* ================== MESSAGES ================== */
    if (!update.message || !update.message.text) return;

    const chatId = update.message.chat.id;
    const userId = update.message.from.id;
    const text = update.message.text.trim();

    console.log("MESSAGE RECEIVED:", text);

    if (text === "/start") {
      console.log("/start HIT");
      await startHandler(chatId, env);
      return;
    }

    if (text === "/r") {
      console.log("/r HIT");
      const res = await studyStartHandler(chatId, userId, env);
      console.log("START HANDLER RESPONSE:", res);

      if (res?.text) {
        await sendMessage(chatId, res.text, env, res.keyboard || null);
      }
      return;
    }

    if (text === "/s") {
      console.log("/s HIT");

      const msg = await studyStopHandler(userId, env);
      console.log("STOP HANDLER MESSAGE:", msg);

      await sendMessage(chatId, "DEBUG: /s STOP REACHED", env);

      if (msg) {
        await sendMessage(chatId, msg, env);
      }
      return;
    }

    if (text.startsWith("/")) {
      await sendMessage(chatId, "Unknown command. Use /start.", env);
    }
  } catch (err) {
    console.error("ROUTER ERROR:", err?.message || err, err?.stack);
  }
    }
