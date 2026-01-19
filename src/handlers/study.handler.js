// src/handlers/study.handler.js

import { sendMessage, editMessage } from "../services/telegram.service.js";

// ===== Helpers (IST) =====
function nowIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000);
}
function fmtTime(d) {
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}
function diffMinutes(startMs, endMs) {
  return Math.floor((endMs - startMs) / 60000);
}
function fmtHM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m.toString().padStart(2, "0")}m`;
}

const DAILY_TARGET_MIN = 8 * 60;
const kvKey = (uid) => `study:active:${uid}`;

// ===== START STUDY (/r) =====
export async function studyStartHandler(chatId, userId, env) {
  const existing = await env.KV.get(kvKey(userId), { type: "json" });
  const now = nowIST();

  // If already running → edit same message (if we have it) or send info
  if (existing) {
    const elapsed = diffMinutes(existing.startTs, now.getTime());
    if (existing.messageId) {
      await editMessage(
        chatId,
        existing.messageId,
        `⚠️ Study session already running.

Started at: ${fmtTime(new Date(existing.startTs))}
Elapsed time: ${fmtHM(elapsed)}

Please stop the current session before starting a new one.`,
        env,
        {
          inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
        }
      );
    } else {
      await sendMessage(
        chatId,
        `⚠️ Study session already running.

Started at: ${fmtTime(new Date(existing.startTs))}
Elapsed time: ${fmtHM(elapsed)}

Please stop the current session before starting a new one.`,
        env,
        {
          inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
        }
      );
    }
    return;
  }

  // New study message
  const res = await sendMessage(
    chatId,
    `📚 Study Started

Study timer started at: ${fmtTime(now)}
Elapsed time: 0m

Default daily target: 8 hours

Stay focused — every minute counts for GPSC Dental Class-2 🦷`,
    env,
    {
      inline_keyboard: [[{ text: "⏹️ Stop Study", callback_data: "STUDY_STOP" }]],
    }
  );

  // Persist session (store messageId for clean edits on stop)
  const messageId = res?.result?.message_id || null;
  await env.KV.put(
    kvKey(userId),
    JSON.stringify({
      startTs: now.getTime(),
      messageId,
    })
  );
}

// ===== STOP STUDY (/s or ⏹️) =====
export async function studyStopHandler(chatId, userId, env) {
  const data = await env.KV.get(kvKey(userId), { type: "json" });
  if (!data) {
    await sendMessage(
      chatId,
      `ℹ️ No active study session found.

Type /r to start studying.`,
      env
    );
    return;
  }

  const end = nowIST();
  const minutes = diffMinutes(data.startTs, end.getTime());

  await env.KV.delete(kvKey(userId));

  let msg;
  if (minutes >= DAILY_TARGET_MIN) {
    msg = `🎯 Daily Target Achieved!

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(minutes)}

Excellent discipline for GPSC Dental Class-2 🏆`;
  } else {
    msg = `⏹️ Study Stopped

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(minutes)}
Remaining target: ${fmtHM(DAILY_TARGET_MIN - minutes)}

Good progress — consistency leads to selection 💪`;
  }

  // Edit SAME message if possible; else send new message
  if (data.messageId) {
    await editMessage(chatId, data.messageId, msg, env, null);
  } else {
    await sendMessage(chatId, msg, env);
  }
    }
