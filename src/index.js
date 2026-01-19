import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    let update;
    try {
      update = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400 });
    }

    // 🔥 THIS IS THE MISSING LINK
    await routeUpdate(update, env);

    return new Response("OK");
  },
};
