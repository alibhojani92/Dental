export function isTextMessage(update) {
  return update.message && typeof update.message.text === "string";
}

export function isCallback(update) {
  return !!update.callback_query;
}
