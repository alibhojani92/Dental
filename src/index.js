import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // 🔎 BASIC HIT LOG
      console.log("WORKER HIT:", request.method, request.url);

      // Telegram webhook always POST
      if (request.method !== "POST") {
        return new Response("OK");
      }

      // Parse update
      const update = await request.json();

      // 🔎 FULL UPDATE LOG
      console.log("TELEGRAM UPDATE:", JSON.stringify(update));

      // Route to bot router
      await routeUpdate(update, env);

      return new Response("OK");
    } catch (err) {
      // 🔥 CRITICAL: catch silent crashes
      console.error("WORKER ERROR:", err?.message || err, err?.stack);
      return new Response("ERROR", { status: 500 });
    }
  },
};
