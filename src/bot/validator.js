export function isValidCallback(data) {
  const allowed = [
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
  return allowed.includes(data);
}
