import { CALLBACKS } from "../utils/constants.js";

/* ===============================
   MAIN MENU
================================ */

export const MAIN_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "📚 Study Zone", callback_data: CALLBACKS.MENU_STUDY }],
    [{ text: "📝 Test Zone", callback_data: CALLBACKS.MENU_TEST }],
    [{ text: "📊 Performance", callback_data: CALLBACKS.MENU_PERFORMANCE }],
    [{ text: "🧠 Revision & Weak Areas", callback_data: CALLBACKS.MENU_REVISION }],
    [{ text: "⏰ Schedule & Target", callback_data: CALLBACKS.MENU_SCHEDULE }],
    [{ text: "🏆 Streak & Rank", callback_data: CALLBACKS.MENU_STREAK }],
    [{ text: "⚙️ Settings", callback_data: CALLBACKS.MENU_SETTINGS }],
    [{ text: "👮 Admin Panel", callback_data: CALLBACKS.MENU_ADMIN }],
    [{ text: "ℹ️ Help", callback_data: CALLBACKS.MENU_HELP }],
  ],
};

/* ===============================
   STUDY MENU
================================ */

export const STUDY_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "▶️ Start Study", callback_data: CALLBACKS.STUDY_START }],
    [{ text: "⏹️ Stop Study", callback_data: CALLBACKS.STUDY_STOP }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   TEST MENU
================================ */

export const TEST_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "📘 Daily MCQ", callback_data: CALLBACKS.TEST_DAILY }],
    [{ text: "📕 Full Test", callback_data: CALLBACKS.TEST_FULL }],
    [{ text: "📊 Test History", callback_data: CALLBACKS.TEST_HISTORY }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   PERFORMANCE MENU
================================ */

export const PERFORMANCE_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "📅 Daily Report", callback_data: CALLBACKS.REPORT_DAILY }],
    [{ text: "📈 Weekly Report", callback_data: CALLBACKS.REPORT_WEEKLY }],
    [{ text: "📉 Weak Areas", callback_data: CALLBACKS.REPORT_WEAK }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   REVISION MENU
================================ */

export const REVISION_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "📚 Subject-wise Revision", callback_data: CALLBACKS.REVISION_SUBJECT }],
    [{ text: "❗ Weak Topics", callback_data: CALLBACKS.REVISION_WEAK }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   SCHEDULE / TARGET MENU
================================ */

export const SCHEDULE_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "🎯 Set Daily Target", callback_data: CALLBACKS.TARGET_SET }],
    [{ text: "📆 View Schedule", callback_data: CALLBACKS.SCHEDULE_VIEW }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   STREAK MENU
================================ */

export const STREAK_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "🔥 My Streak", callback_data: CALLBACKS.STREAK_MY }],
    [{ text: "🏅 Rank List", callback_data: CALLBACKS.STREAK_RANK }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   SETTINGS MENU
================================ */

export const SETTINGS_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "🌐 Language", callback_data: CALLBACKS.SETTINGS_LANGUAGE }],
    [{ text: "🔔 Notifications", callback_data: CALLBACKS.SETTINGS_NOTIFY }],
    [{ text: "🕒 Timezone (IST)", callback_data: CALLBACKS.SETTINGS_TIMEZONE }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   ADMIN MENU (PHASE-1 STUB)
================================ */

export const ADMIN_MENU_KEYBOARD = {
  inline_keyboard: [
    [{ text: "➕ Add Subject", callback_data: CALLBACKS.ADMIN_ADD_SUBJECT }],
    [{ text: "📤 Upload MCQs", callback_data: CALLBACKS.ADMIN_UPLOAD_MCQ }],
    [{ text: "📊 Admin Reports", callback_data: CALLBACKS.ADMIN_REPORTS }],
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};

/* ===============================
   BACK ONLY
================================ */

export const BACK_TO_MAIN_KEYBOARD = {
  inline_keyboard: [
    [{ text: "⬅️ Back to Main Menu", callback_data: CALLBACKS.BACK_TO_MAIN }],
  ],
};
