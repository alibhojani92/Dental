import router from "./bot/router.js";

export default {
  async fetch(req, env) {
    if (req.method !== "POST") {
      return new Response("OK");
    }

    const update = await req.json();
    await router(update, env);

    return new Response("OK");
  },
};
