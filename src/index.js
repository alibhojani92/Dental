import { routeUpdate } from "./bot/router.js";

/**
 * Cloudflare Worker entry point
 * Receives Telegram webhook updates
 */
export default {
  async fetch(request, env) {
    // Health check or browser hit
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    try {
      const update = await request.json();

      // 🔍 LOG EVERY UPDATE (VERY IMPORTANT FOR DEBUG)
      console.log("TELEGRAM UPDATE:", JSON.stringify(update));

      // Route update to bot router
      await routeUpdate(update, env);
    } catch (err) {
      console.error("INDEX ERROR:", err);
    }

    // Telegram requires 200 OK always
    return new Response("OK", { status: 200 });
  }
};
