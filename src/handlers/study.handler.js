/**
 * STUDY HANDLER (PHASE-3 REWRITE)
 * Fits Phase-1 router/commands WITHOUT changes
 */

import {
  engineStartStudy,
  engineStopStudy,
} from "../engine/study.engine.js";
import { sendMessage, answerCallback } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";
import { STUDY_MENU_KEYBOARD } from "../ui/keyboards.js";
import { CALLBACKS } from "../utils/constants.js";

/* ===============================
   COMMAND ENTRY POINTS
   (Called by Phase-1 router/commands)
================================ */

/**
 * /r
 */
export async function handleStartStudyCommand(message, env) {
  const chatId = message.chat.id;
  const user = message.from;

  const result = await engineStartStudy(user, env);

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

/**
 * /s
 */
export async function handleStopStudyCommand(message, env) {
  const chatId = message.chat.id;
  const user = message.from;

  const result = await engineStopStudy(user, env);

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
   INLINE CALLBACK ENTRY POINT
   (Called by Phase-1 menu handler)
================================ */

export async function handleStudyCallback(callbackQuery, env) {
  const data = callbackQuery.data;
  const message = callbackQuery.message;

  // Stop Telegram spinner
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
