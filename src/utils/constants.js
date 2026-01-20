/**
 * GLOBAL CONSTANTS
 * Phase-1: UI + Core
 * No business logic here
 */

/* ===============================
   COMMANDS
================================ */
export const COMMANDS = {
  START: "/start",
  START_STUDY: "/r",
  STOP_STUDY: "/s",
  HELP: "/help",
};

/* ===============================
   MAIN MENU CALLBACKS
================================ */
export const CALLBACKS = {
  MENU_STUDY: "MENU_STUDY",
  MENU_TEST: "MENU_TEST",
  MENU_PERFORMANCE: "MENU_PERFORMANCE",
  MENU_REVISION: "MENU_REVISION",
  MENU_SCHEDULE: "MENU_SCHEDULE",
  MENU_STREAK: "MENU_STREAK",
  MENU_SETTINGS: "MENU_SETTINGS",
  MENU_ADMIN: "MENU_ADMIN",
  MENU_HELP: "MENU_HELP",

  /* -----------------------------
     STUDY
  ----------------------------- */
  STUDY_START: "STUDY_START",
  STUDY_STOP: "STUDY_STOP",

  /* -----------------------------
     TEST
  ----------------------------- */
  TEST_DAILY: "TEST_DAILY",
  TEST_FULL: "TEST_FULL",
  TEST_HISTORY: "TEST_HISTORY",

  /* -----------------------------
     PERFORMANCE
  ----------------------------- */
  REPORT_DAILY: "REPORT_DAILY",
  REPORT_WEEKLY: "REPORT_WEEKLY",
  REPORT_WEAK: "REPORT_WEAK",

  /* -----------------------------
     REVISION
  ----------------------------- */
  REVISION_SUBJECT: "REVISION_SUBJECT",
  REVISION_WEAK: "REVISION_WEAK",

  /* -----------------------------
     SCHEDULE / TARGET
  ----------------------------- */
  TARGET_SET: "TARGET_SET",
  SCHEDULE_VIEW: "SCHEDULE_VIEW",

  /* -----------------------------
     STREAK
  ----------------------------- */
  STREAK_MY: "STREAK_MY",
  STREAK_RANK: "STREAK_RANK",

  /* -----------------------------
     SETTINGS
  ----------------------------- */
  SETTINGS_LANGUAGE: "SETTINGS_LANGUAGE",
  SETTINGS_NOTIFY: "SETTINGS_NOTIFY",
  SETTINGS_TIMEZONE: "SETTINGS_TIMEZONE",

  /* -----------------------------
     ADMIN
  ----------------------------- */
  ADMIN_ADD_SUBJECT: "ADMIN_ADD_SUBJECT",
  ADMIN_UPLOAD_MCQ: "ADMIN_UPLOAD_MCQ",
  ADMIN_REPORTS: "ADMIN_REPORTS",

  /* -----------------------------
     NAVIGATION
  ----------------------------- */
  BACK_TO_MAIN: "BACK_TO_MAIN",
};
