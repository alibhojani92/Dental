import { sendMessage } from "../services/telegram.service.js";

export async function startHandler(message, env) {
  const chatId = message.chat.id;

  const text =
    "Welcome to GPSC Dental Class-2 Preparation Bot 🦷\n\n" +
    "Your complete companion for:\n" +
    "• Smart study tracking\n" +
    "• Exam-oriented MCQ tests\n" +
    "• Performance analysis\n" +
    "• Consistent preparation\n\n" +
    "Choose an option below 👇";

  const keyboard = {
    inline_keyboard: [
      [{ text: "📚 Study Zone", callback_data: "MENU_STUDY" }],
      [{ text: "📝 Test Zone", callback_data: "MENU_TEST" }],
      [{ text: "📊 Performance", callback_data: "MENU_PERFORMANCE" }],
      [{ text: "🧠 Revision & Weak Areas", callback_data: "MENU_REVISION" }],
      [{ text: "⏰ Schedule & Target", callback_data: "MENU_SCHEDULE" }],
      [{ text: "🏆 Streak & Rank", callback_data: "MENU_STREAK" }],
      [{ text: "⚙️ Settings", callback_data: "MENU_SETTINGS" }],
      [{ text: "👮 Admin Panel", callback_data: "MENU_ADMIN" }],
      [{ text: "ℹ️ Help", callback_data: "MENU_HELP" }],
    ],
  };

  // ✅ CORRECT ORDER
  await sendMessage(chatId, text, env, keyboard);
}
