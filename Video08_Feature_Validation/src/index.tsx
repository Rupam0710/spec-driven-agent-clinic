import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Home } from "./pages/Home";

export const app = new Hono();

app.use("/static/*", serveStatic({ root: "./" }));

app.get("/", (c) => {
  return c.html(<Home />);
});

// Only boot a real HTTP server outside of the test runner, so the Vitest
// validation suite can import `app` and exercise routes without a live port.
if (process.env.NODE_ENV !== "test") {
  serve({ fetch: app.fetch, port: 3000 }, (info) => {
    console.log(`Server running at http://localhost:${info.port}`);
  });
}
