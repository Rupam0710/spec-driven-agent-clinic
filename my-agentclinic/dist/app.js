import { jsx as _jsx } from "hono/jsx/jsx-runtime";
import { Hono } from "hono";
import { Home } from "./pages/Home";
// The Hono app and its routes. Exported (rather than served here) so tests can
// call `app.request(...)` without starting a network listener.
export const app = new Hono();
app.get("/", (c) => {
    return c.html(_jsx(Home, {}));
});
app.get("/health", (c) => {
    return c.json({ status: "ok" });
});
