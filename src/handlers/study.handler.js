// src/handlers/study.handler.js

import { sendMessage, editMessage } from "../services/telegram.service.js";

/* ===== Helpers (IST – SAFE) ===== */
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

/* ===== START STUDY (/r) ===== */
export async function studyStartHandler(chatId, userId, env) {
  const existing = await env.KV.get(kvKey(userId), { type: "json" });
  const startTs = Date.now();

  if (existing) {
    const elapsed = diffMinutes(existing.startTs, startTs);
    await sendMessage(
      chatId,
      `Study session already running.

Started at: ${fmtTime(existing.startTs)}
Elapsed time: ${fmtHM(elapsed)}

Please stop the current session before starting a new one.`,
      env,
      {
        inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
      }
    );
    return;
  }

  const res = await sendMessage(
    chatId,
    `Study Started

Study timer started at: ${fmtTime(startTs)}
Elapsed time: 0m

Default daily target: 8 hours

Stay focused — every minute counts for GPSC Dental Class-2`,
    env,
    {
      inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
    }
  );

  await env.KV.put(
    kvKey(userId),
    JSON.stringify({
      startTs,
      messageId: res?.result?.message_id || null,
    })
  );
}

/* ===== STOP STUDY (/s or ⏹️) ===== */
export async function studyStopHandler(chatId, userId, env) {
  const data = await env.KV.get(kvKey(userId), { type: "json" });
  if (!data) {
    await sendMessage(chatId, "No active study session found.\nType /r to start.", env);
    return;
  }

  const endTs = Date.now();
  const minutes = diffMinutes(data.startTs, endTs);
  await env.KV.delete(kvKey(userId));

  let msg;
  if (minutes >= DAILY_TARGET_MIN) {
    msg = `Daily Target Achieved!

Started at: ${fmtTime(data.startTs)}
Stopped at: ${fmtTime(endTs)}

Total studied today: ${fmtHM(minutes)}

Excellent discipline for GPSC Dental Class-2`;
  } else {
    msg = `Study Stopped

Started at: ${fmtTime(data.startTs)}
Stopped at: ${fmtTime(endTs)}

Total studied today: ${fmtHM(minutes)}
Remaining target: ${fmtHM(DAILY_TARGET_MIN - minutes)}

Good progress — consistency matters`;
  }

  /* SAFE SEND: try edit, fallback to send */
  if (data.messageId) {
    try {
      await editMessage(chatId, data.messageId, msg, env, null);
    } catch {
      await sendMessage(chatId, msg, env);
    }
  } else {
    await sendMessage(chatId, msg, env);
  }
  }
