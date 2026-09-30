import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Encodes the non-runtime items of the Phase 1 Definition of Done so they
// can't silently regress: Hono must stay version-pinned and TypeScript strict.

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(relPath: string): Record<string, any> {
  return JSON.parse(readFileSync(resolve(projectRoot, relPath), "utf8"));
}

function readText(relPath: string): string {
  return readFileSync(resolve(projectRoot, relPath), "utf8");
}

describe("Hono version is pinned", () => {
  it("lists hono without a ^ or ~ range prefix", () => {
    const pkg = readJson("package.json");
    const version: string | undefined = pkg.dependencies?.hono;
    expect(version).toBeDefined();
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

describe("Strict TypeScript is enabled", () => {
  it("sets compilerOptions.strict to true in tsconfig.json", () => {
    const tsconfig = readJson("tsconfig.json");
    expect(tsconfig.compilerOptions?.strict).toBe(true);
  });
});

describe("Stylesheet is mobile-first and responsive", () => {
  const css = readText("static/style.css");

  it("includes at least one min-width media query", () => {
    expect(css).toMatch(/@media\s*\(min-width:/);
  });

  it("uses a fluid max-width rather than fixed pixel widths for layout", () => {
    expect(css).toMatch(/max-width:\s*\d+(\.\d+)?rem/);
  });
});
