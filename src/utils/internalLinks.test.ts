import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

// Comments are blanked, not removed, so line numbers and neighbouring lines stay true.
const stripComments = (line: string): string =>
  line.replace(/\{?\/\*.*?\*\/\}?/g, '').replace(/(^|\s)\/\/.*$/, '').replace(/^\s*\*.*$/, '');

// Real source files only: no symlinks, type declarations or tests.
const srcDir = fileURLToPath(new URL('../', import.meta.url));
const sourceLines = readdirSync(srcDir, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name))
  .filter((entry) => !/\.d\.[cm]?ts$|\.(test|spec)\.[cm]?[jt]sx?$/.test(entry.name))
  .flatMap((entry) => {
    const path = join(entry.parentPath, entry.name);
    const file = relative(srcDir, path).split('\\').join('/');
    const code = readFileSync(path, 'utf8').split('\n').map(stripComments);
    const nearestCode = (from: number, step: number): string => {
      for (let i = from; i >= 0 && i < code.length; i += step) if (code[i].trim()) return code[i];
      return '';
    };
    return code.map((line, i) => ({
      file,
      line,
      near: [nearestCode(i - 1, -1), line, nearestCode(i + 1, 1)],
      at: `${file}:${i + 1}`,
    }));
  });

// Places where a string becomes a navigation target.
const NAV_SINK =
  /href=|pathname:|router\.(push|replace)\(|redirect\(|\blocation\.(assign|replace)\(|\blocation(\.href)?\s*=(?!=)|window\.open\(/;
// A path whose first segment is a variable: `/${x}` or '/' + x.
const VARIABLE_PATH = /`\/\$\{|["']\/["']\s*\+/;

describe('internal links', () => {
  // app/[pool] is the only dynamic top-level route and generateStaticParams exports only "pool",
  // so a link to `/${x}` points at a page the static export never built (404, or 500 in dev).
  // Heuristic: a variable-first path with a navigation call on the same or the nearest code line.
  it('never navigate to a path that starts with a variable', () => {
    const offenders = sourceLines
      .filter(({ line, near }) => VARIABLE_PATH.test(line) && near.some((l) => NAV_SINK.test(l)))
      .map(({ at }) => at);

    expect(offenders).toEqual([]);
  });

  // Strict on purpose: one builder for pool URLs, so they cannot drift apart again.
  it('mention /pool? only in utils/routes.ts', () => {
    const offenders = sourceLines
      .filter(({ file, line }) => line.includes('/pool?') && file !== 'utils/routes.ts')
      .map(({ at }) => at);

    expect(offenders).toEqual([]);
  });
});
