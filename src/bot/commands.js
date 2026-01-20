// src/bot/commands.js

import { startHandler } from "../handlers/start.handler.js";
import {
  startStudyCommand,
  stopStudyCommand,
} from "../handlers/study.handler.js";
import { sendMessage } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";

export async function handleCommand(command, chatId, env, message) {
  switch (command) {
    case "/start":
      await startHandler(chatId, env);
      return;

    case "/r":
      await startStudyCommand(message, env);
      return;

    case "/s":
      await stopStudyCommand(message, env);
      return;

    case "/help":
      await sendMessage(chatId, MESSAGES.HELP_TEXT, env);
      return;

    default:
      await sendMessage(chatId, MESSAGES.UNKNOWN_COMMAND, env);
      return;
  }
}
