import { routeUpdate } from "./bot/router.js";

export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("OK");
    }

    try {
      const update = await request.json();

      console.log("TELEGRAM UPDATE:", JSON.stringify(update));

      await routeUpdate(update, env);

      return new Response("OK");
    } catch (err) {
      console.error("INDEX ERROR:", err);
      return new Response("ERROR");
    }
  },
};
