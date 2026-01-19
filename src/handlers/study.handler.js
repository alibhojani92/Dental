import { sendMessage, editMessage } from "../services/message.service.js";
import { getActiveStudy, startStudy, stopStudy } from "../engine/timer.engine.js";
import { STUDY_ACTIVE_KEYBOARD } from "../bot/keyboards.js";

function nowIST() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000);
}
function fmtTime(d) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}
function diffMin(a, b) {
  return Math.floor((b - a) / 60000);
}
function fmtHM(m) {
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

const TARGET = 480;

export async function startReading(chatId, userId, env) {
  const active = await getActiveStudy(env.KV, userId);
  const now = nowIST();

  if (active) {
    const elapsed = diffMin(active.startTs, now.getTime());
    await editMessage(
      chatId,
      active.messageId,
      `⚠️ Study session already running.

Started at: ${fmtTime(new Date(active.startTs))}
Elapsed time: ${fmtHM(elapsed)}`,
      env,
      STUDY_ACTIVE_KEYBOARD
    );
    return;
  }

  const res = await sendMessage(
    chatId,
    `📚 Study Started

Study timer started at: ${fmtTime(now)}
Elapsed time: 0m

Default daily target: 8 hours`,
    env,
    STUDY_ACTIVE_KEYBOARD
  );

  await startStudy(env.KV, userId, {
    startTs: now.getTime(),
    messageId: res?.result?.message_id || null,
  });
}

export async function stopReading(chatId, userId, messageId, env) {
  const data = await stopStudy(env.KV, userId);
  if (!data) return;

  const end = nowIST();
  const mins = diffMin(data.startTs, end.getTime());

  const msg =
    mins >= TARGET
      ? `🎯 Daily Target Achieved!

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(mins)}`
      : `⏹️ Study Stopped

Started at: ${fmtTime(new Date(data.startTs))}
Stopped at: ${fmtTime(end)}

Total studied today: ${fmtHM(mins)}
Remaining target: ${fmtHM(TARGET - mins)}`;

  await editMessage(chatId, messageId, msg, env, null);
                   }
