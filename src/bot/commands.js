/**
 * COMMAND HANDLER
 * Phase-3 SAFE VERSION
 */

import { showStartMenu } from "../handlers/start.handler.js";
import {
  handleStartStudyCommand,
  handleStopStudyCommand,
} from "../handlers/study.handler.js";
import { sendMessage } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";

export async function handleCommand(command, chatId, env, message = null) {
  try {
    switch (command) {
      case "/start":
        await showStartMenu(chatId, env);
        break;

      case "/r":
        // 🔒 FORCE study handler
        if (message) {
          await handleStartStudyCommand(message, env);
        }
        break;

      case "/s":
        // 🔒 FORCE study handler
        if (message) {
          await handleStopStudyCommand(message, env);
        }
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
