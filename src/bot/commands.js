import { sendMessage } from "../services/telegram.service.js";
import { showStartMenu } from "../handlers/start.handler.js";
import { MESSAGES } from "../ui/messages.js";

/**
 * Handle slash commands
 * /start
 * /r
 * /s
 * /help
 */
export async function handleCommand(command, chatId, env) {
  try {
    switch (command) {
      case "/start":
        await showStartMenu(chatId, env);
        break;

      case "/r":
        // Phase-1: UI only (no study logic yet)
        await sendMessage(chatId, MESSAGES.START_STUDY_PLACEHOLDER, env);
        break;

      case "/s":
        // Phase-1: UI only (no stop logic yet)
        await sendMessage(chatId, MESSAGES.STOP_STUDY_PLACEHOLDER, env);
        break;

      case "/help":
        await sendMessage(chatId, MESSAGES.HELP_TEXT, env);
        break;

      default:
        await sendMessage(chatId, MESSAGES.UNKNOWN_COMMAND, env);
        break;
    }
  } catch (err) {
    console.error("COMMAND HANDLER ERROR:", err);
  }
}
