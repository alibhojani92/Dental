import { CALLBACKS } from "../config/constants.js";

export function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "📚 Study Zone", callback_data: CALLBACKS.MENU_STUDY }],
      [{ text: "📝 Test Zone", callback_data: CALLBACKS.MENU_TEST }],
      [{ text: "📊 Reports", callback_data: CALLBACKS.MENU_REPORT }],
      [{ text: "⚙️ Settings", callback_data: CALLBACKS.MENU_SETTINGS }],
      [{ text: "👮 Admin Panel", callback_data: CALLBACKS.MENU_ADMIN }],
      [{ text: "ℹ️ Help", callback_data: CALLBACKS.MENU_HELP }],
    ],
  };
}
