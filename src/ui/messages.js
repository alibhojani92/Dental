/**
 * ALL BOT MESSAGES
 * Phase-1 + Phase-3
 * No logic, only text + formatting helpers
 */

/* ===============================
   TIME FORMAT HELPERS
================================ */

function formatTime(ts) {
  const date = new Date(ts * 1000);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

/* ===============================
   MESSAGES
================================ */

export const MESSAGES = {
  /* -----------------------------
     PHASE-1: START / MAIN
  ----------------------------- */
  START_WELCOME: `Welcome to GPSC Dental Class-2 Preparation Bot 🦷

Your complete companion for:
• Smart study tracking
• Exam-oriented MCQ tests
• Performance analysis
• Consistent preparation

Choose an option below 👇`,

  GENERIC_COMING_SOON: `🚧 Feature will be activated in upcoming phases.
Stay consistent for GPSC Dental Class-2 🏆`,

  UNKNOWN_COMMAND: `❓ Unknown command.

Type /help to see available commands.`,

  /* -----------------------------
     PHASE-1: MENUS
  ----------------------------- */
  STUDY_MENU_TEXT: `📚 Study Zone

Track your daily study time with precision.
Start and stop sessions anytime.

Choose an action 👇`,

  TEST_MENU_TEXT: `📝 Test Zone

Practice exam-oriented MCQs and full tests.

Tests will be activated in a later phase.`,

  PERFORMANCE_MENU_TEXT: `📊 Performance Dashboard

View your progress, accuracy and consistency.

Performance data will appear after tests & study tracking.`,

  REVISION_MENU_TEXT: `🧠 Revision & Weak Areas

Identify subjects and topics that need more focus.

This feature unlocks after test analysis.`,

  SCHEDULE_MENU_TEXT: `⏰ Schedule & Target

Set daily study targets and manage your schedule.

Default target: 8 hours`,

  STREAK_MENU_TEXT: `🏆 Streak & Rank

Maintain consistency and build winning streaks.

Streaks activate after daily study tracking.`,

  SETTINGS_MENU_TEXT: `⚙️ Settings

Customize your experience.`,

  ADMIN_ACCESS_DENIED: `⛔ Access Denied

This section is restricted to admins only.`,

  HELP_TEXT: `ℹ️ Help & Commands

Available commands:
/start – Restart bot
/r – Start Study
/s – Stop Study
/help – Show help

For support, contact admin.`,

  /* -----------------------------
     PHASE-3: STUDY
  ----------------------------- */

  STUDY_STARTED: (startTs) => `📚 Study Started

Started at: ${formatTime(startTs)}

Stay focused for GPSC Dental Class-2 🏆`,

  STUDY_ALREADY_RUNNING: (startTs) => `⚠️ Study Already Running

Started at: ${formatTime(startTs)}

Keep going strong 💪`,

  STUDY_NOT_RUNNING: `❗ No active study session found.

Type /r or tap ▶️ Start Study to begin.`,

  STUDY_ERROR: `⚠️ Something went wrong while stopping study.
Please try again.`,

  STUDY_STOPPED_SUMMARY: ({ startTs, endTs, studiedSeconds, targetMinutes }) => {
    const duration = formatDuration(studiedSeconds);
    const targetText = targetMinutes
      ? `\nDaily Target: ${targetMinutes} minutes`
      : "";

    return `🎯 Study Session Completed!

Started at: ${formatTime(startTs)}
Stopped at: ${formatTime(endTs)}

Total studied today: ${duration}${targetText}

Excellent discipline for GPSC Dental Class-2 🏆`;
  },
};
