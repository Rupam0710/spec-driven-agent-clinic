import type { FC, PropsWithChildren } from "hono/jsx";

// Primary content region; each page renders its body inside here.
export const Main: FC<PropsWithChildren> = ({ children }) => (
  <main>{children}</main>
);
