import { sendMessage } from "../services/telegram.service.js";
import { MAIN_MENU_KEYBOARD } from "../ui/keyboards.js";
import { MESSAGES } from "../ui/messages.js";

/**
 * Show main start menu
 * Called only from /start command
 */
export async function showStartMenu(chatId, env) {
  try {
    await sendMessage(
      chatId,
      MESSAGES.START_WELCOME,
      env,
      MAIN_MENU_KEYBOARD
    );
  } catch (err) {
    console.error("START HANDLER ERROR:", err);
  }
}
