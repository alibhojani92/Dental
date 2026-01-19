import { sendMessage } from "../services/message.service.js";
import { MAIN_MENU_KEYBOARD } from "../bot/keyboards.js";
import { MESSAGES } from "../bot/messages.js";

export async function startHandler(chatId, env) {
  await sendMessage(chatId, MESSAGES.WELCOME, env, MAIN_MENU_KEYBOARD);
}
