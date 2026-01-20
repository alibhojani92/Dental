/**
 * COMMAND HANDLER
 * Phase-1 compatible
 * Phase-3 study-safe
 */

import { startHandler } from "../handlers/start.handler.js";
import {
  handleStartStudyCommand,
  handleStopStudyCommand,
} from "../handlers/study.handler.js";
import { sendMessage } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";

/**
 * Named export — Phase-1 contract
 */
export async function handleCommand(command, chatId, env, message) {
  try {
    switch (command) {
      case "/start":
        await startHandler(chatId, env);
        return;

      case "/r":
        // Phase-3 study start
        await handleStartStudyCommand(message, env);
        return;

      case "/s":
        // Phase-3 study stop
        await handleStopStudyCommand(message, env);
        return;

      case "/help":
        await sendMessage(chatId, MESSAGES.HELP_TEXT, env);
        return;

      default:
        await sendMessage(chatId, MESSAGES.UNKNOWN_COMMAND, env);
        return;
    }
  } catch (err) {
    console.error("COMMAND HANDLER ERROR:", err);
  }
}
