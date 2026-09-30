import type { FC, PropsWithChildren } from "hono/jsx";
import { Header } from "./Header";
import { Main } from "./Main";
import { Footer } from "./Footer";

// Top-level page shell: the HTML document plus the header / main / footer
// structure. Page content is passed as children and rendered inside <Main>.
export const Layout: FC<PropsWithChildren> = ({ children }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>AgentClinic</title>
      <link rel="stylesheet" href="/static/style.css" />
    </head>
    <body>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </body>
  </html>
);
