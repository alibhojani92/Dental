export const CALLBACK_IDS = [
  "MENU_STUDY",
  "MENU_TEST",
  "MENU_PERFORMANCE",
  "MENU_REVISION",
  "MENU_SCHEDULE",
  "MENU_STREAK",
  "MENU_SETTINGS",
  "MENU_ADMIN",
  "MENU_HELP",
];

export function isValidCallback(data) {
  return CALLBACK_IDS.includes(data);
}
