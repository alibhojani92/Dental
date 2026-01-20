import { sendMessage, answerCallback } from "../services/telegram.service.js";
import { MESSAGES } from "../ui/messages.js";
import {
  MAIN_MENU_KEYBOARD,
  STUDY_MENU_KEYBOARD,
  TEST_MENU_KEYBOARD,
  PERFORMANCE_MENU_KEYBOARD,
  REVISION_MENU_KEYBOARD,
  SCHEDULE_MENU_KEYBOARD,
  STREAK_MENU_KEYBOARD,
  SETTINGS_MENU_KEYBOARD,
  ADMIN_MENU_KEYBOARD,
  BACK_TO_MAIN_KEYBOARD,
} from "../ui/keyboards.js";
import { CALLBACKS } from "../utils/constants.js";

/**
 * Handle inline keyboard menu callbacks
 */
export async function handleMenuCallback(callbackQuery, env) {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  try {
    // Always answer callback to stop loading spinner
    await answerCallback(callbackQuery.id, env);

    switch (data) {
      /* ---------- MAIN MENUS ---------- */
      case CALLBACKS.MENU_STUDY:
        await sendMessage(
          chatId,
          MESSAGES.STUDY_MENU_TEXT,
          env,
          STUDY_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_TEST:
        await sendMessage(
          chatId,
          MESSAGES.TEST_MENU_TEXT,
          env,
          TEST_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_PERFORMANCE:
        await sendMessage(
          chatId,
          MESSAGES.PERFORMANCE_MENU_TEXT,
          env,
          PERFORMANCE_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_REVISION:
        await sendMessage(
          chatId,
          MESSAGES.REVISION_MENU_TEXT,
          env,
          REVISION_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_SCHEDULE:
        await sendMessage(
          chatId,
          MESSAGES.SCHEDULE_MENU_TEXT,
          env,
          SCHEDULE_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_STREAK:
        await sendMessage(
          chatId,
          MESSAGES.STREAK_MENU_TEXT,
          env,
          STREAK_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_SETTINGS:
        await sendMessage(
          chatId,
          MESSAGES.SETTINGS_MENU_TEXT,
          env,
          SETTINGS_MENU_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_ADMIN:
        await sendMessage(
          chatId,
          MESSAGES.ADMIN_ACCESS_DENIED,
          env,
          BACK_TO_MAIN_KEYBOARD
        );
        break;

      case CALLBACKS.MENU_HELP:
        await sendMessage(
          chatId,
          MESSAGES.HELP_TEXT,
          env,
          BACK_TO_MAIN_KEYBOARD
        );
        break;

      /* ---------- BACK ---------- */
      case CALLBACKS.BACK_TO_MAIN:
        await sendMessage(
          chatId,
          MESSAGES.START_WELCOME,
          env,
          MAIN_MENU_KEYBOARD
        );
        break;

      /* ---------- FALLBACK ---------- */
      default:
        await sendMessage(
          chatId,
          MESSAGES.GENERIC_COMING_SOON,
          env,
          BACK_TO_MAIN_KEYBOARD
        );
        break;
    }
  } catch (err) {
    console.error("MENU HANDLER ERROR:", err);
  }
          }
