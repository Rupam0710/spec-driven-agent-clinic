import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";

// Optional per-page title; when set it is prefixed onto the brand name.
type LayoutProps = PropsWithChildren<{ title?: string }>;

// Top-level page shell: the HTML document plus the header / main / footer
// structure. Page content is passed as children and rendered inside <Main>.
// Styling comes from Pico CSS (classless CDN build) with small project
// overrides layered on top via /static/style.css.
export const Layout: FC<LayoutProps> = ({ title, children }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title ? `${title} · AgentClinic` : "AgentClinic"}</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.classless.min.css"
      />
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </body>
  </html>
);
