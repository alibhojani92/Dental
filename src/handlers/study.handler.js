// src/handlers/study.handler.js

/* ===== Helpers (IST safe) ===== */
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
}

function diffMinutes(startMs, endMs) {
  return Math.floor((endMs - startMs) / 60000);
}

function fmtHM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

const DAILY_TARGET_MIN = 8 * 60;
const kvKey = (uid) => `study:active:${uid}`;

/* ===== START STUDY ===== */
export async function studyStartHandler(chatId, userId, env) {
  const existing = await env.KV.get(kvKey(userId), { type: "json" });
  const startTs = Date.now();

  if (existing) {
    const elapsed = diffMinutes(existing.startTs, startTs);
    return {
      text: `Study session already running.

Started at: ${fmtTime(existing.startTs)}
Elapsed time: ${fmtHM(elapsed)}

Please stop the current session first.`,
      keyboard: {
        inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
      },
    };
  }

  await env.KV.put(
    kvKey(userId),
    JSON.stringify({ startTs })
  );

  return {
    text: `Study Started

Study timer started at: ${fmtTime(startTs)}
Elapsed time: 0m

Default daily target: 8 hours`,
    keyboard: {
      inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
    },
  };
}

/* ===== STOP STUDY ===== */
export async function studyStopHandler(userId, env) {
  const data = await env.KV.get(kvKey(userId), { type: "json" });
  if (!data) {
    return "No active study session found.";
  }

  const endTs = Date.now();
  const minutes = diffMinutes(data.startTs, endTs);
  await env.KV.delete(kvKey(userId));

  if (minutes >= DAILY_TARGET_MIN) {
    return `🎯 Daily Target Achieved!

Started at: ${fmtTime(data.startTs)}
Stopped at: ${fmtTime(endTs)}

Total studied today: ${fmtHM(minutes)}

Excellent discipline for GPSC Dental Class-2 🏆`;
  }

  return `Study Stopped

Started at: ${fmtTime(data.startTs)}
Stopped at: ${fmtTime(endTs)}

Total studied today: ${fmtHM(minutes)}
Remaining target: ${fmtHM(DAILY_TARGET_MIN - minutes)}`;
    }
