// src/handlers/start.handler.js

import { sendMessage } from "../services/telegram.service.js";
import { MAIN_MENU_KEYBOARD } from "../ui/keyboards.js";
import { MESSAGES } from "../ui/messages.js";

/**
 * Named export (IMPORTANT)
 */
export async function startHandler(chatId, env) {
  await sendMessage(
    chatId,
    MESSAGES.START_WELCOME,
    env,
    MAIN_MENU_KEYBOARD
  );
}
