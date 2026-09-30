import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";

// The Hono app and its routes. Exported (rather than served here) so tests can
// call `app.request(...)` without starting a network listener.
export const app = new Hono();

// Serve the static assets (e.g. /static/style.css) from the `static/` dir.
app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(<Home />);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});
