import { sendMessage, answerCallback } from "../services/telegram.service.js";
import { mainMenuKeyboard } from "./keyboards.js";
import { START_MESSAGE } from "./messages.js";
import { isTextMessage, isCallback } from "./validator.js";
import { CALLBACKS } from "../config/constants.js";

export default async function router(update, env) {
  /* COMMANDS */
  if (isTextMessage(update)) {
    const chatId = update.message.chat.id;
    const text = update.message.text.trim();

    if (text === "/start") {
      await sendMessage(chatId, START_MESSAGE, env, mainMenuKeyboard());
      return;
    }
  }

  /* CALLBACKS */
  if (isCallback(update)) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const data = cb.data;

    await answerCallback(cb.id, env);

    if (Object.values(CALLBACKS).includes(data)) {
      await sendMessage(
        chatId,
        "Feature will be activated in upcoming phases 🚧",
        env
      );
    }
  }
}
