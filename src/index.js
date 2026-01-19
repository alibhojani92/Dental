import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    try {
      const update = await request.json();
      // never block Telegram response
      ctx.waitUntil(routeUpdate(update, env));
    } catch (err) {
      console.error("Webhook error:", err);
    }

    // Telegram must ALWAYS receive 200
    return new Response("OK", { status: 200 });
  },
};
