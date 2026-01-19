import router from "./bot/router.js";

export default {
  async fetch(request, env, ctx) {
    try {
      console.log("WORKER HIT:", request.method, request.url);

      if (request.method !== "POST") {
        return new Response("OK");
      }

      const update = await request.json();
      console.log("TELEGRAM UPDATE:", JSON.stringify(update));

      await router(update, env);

      return new Response("OK");
    } catch (err) {
      console.error("WORKER ERROR:", err?.message || err);
      return new Response("ERROR", { status: 500 });
    }
  },
};
