/**
 * STUDY HANDLER
 * Phase-3: Telegram ↔ Study Engine bridge
 */

import { startStudy, stopStudy } from "../engine/study.engine.js";
import { sendMessage, answerCallback } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";
import { STUDY_MENU_KEYBOARD } from "../ui/keyboards.js";
import { CALLBACKS } from "../utils/constants.js";

/* ===============================
   COMMAND HANDLERS
================================ */

export async function handleStartStudyCommand(message, env) {
  const user = message.from;
  const chatId = message.chat.id;

  const result = await startStudy(user, env);

  if (result.status === "ALREADY_RUNNING") {
    await sendMessage(
      chatId,
      MESSAGES.STUDY_ALREADY_RUNNING(result.startTs),
      env,
      STUDY_MENU_KEYBOARD
    );
    return;
  }

  await sendMessage(
    chatId,
    MESSAGES.STUDY_STARTED(result.startTs),
    env,
    STUDY_MENU_KEYBOARD
  );
}

export async function handleStopStudyCommand(message, env) {
  const user = message.from;
  const chatId = message.chat.id;

  const result = await stopStudy(user, env);

  if (result.status === "NOT_RUNNING") {
    await sendMessage(chatId, MESSAGES.STUDY_NOT_RUNNING, env);
    return;
  }

  if (result.status !== "STOPPED") {
    await sendMessage(chatId, MESSAGES.STUDY_ERROR, env);
    return;
  }

  await sendMessage(
    chatId,
    MESSAGES.STUDY_STOPPED_SUMMARY({
      startTs: result.startTs,
      endTs: result.endTs,
      studiedSeconds: result.studiedSeconds,
      targetMinutes: result.targetMinutes,
    }),
    env
  );
}

/* ===============================
   INLINE CALLBACK HANDLERS
================================ */

export async function handleStudyCallback(callbackQuery, env) {
  const data = callbackQuery.data;
  const message = callbackQuery.message;

  await answerCallback(callbackQuery.id, env);

  if (data === CALLBACKS.STUDY_START) {
    await handleStartStudyCommand(message, env);
    return;
  }

  if (data === CALLBACKS.STUDY_STOP) {
    await handleStopStudyCommand(message, env);
    return;
  }
      }
