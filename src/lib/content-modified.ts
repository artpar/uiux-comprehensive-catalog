import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

/** Build-time dates from content history, never from checkout or verification dates. */
export function contentModifiedDates(root = process.cwd()) {
  const dates = new Map<string, string>();
  const dependencies = new Map<string, string[]>();
  const git = (args: string[]) => execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
  try {
    // Read history once: per-URL git processes make large catalog builds expensive.
    let date = "";
    for (const line of git(["log", "--format=DATE:%cs", "--name-only", "--", "src"]).split("\n")) {
      if (line.startsWith("DATE:")) date = line.slice(5);
      else if (line.startsWith("src/") && date) {
        const previous = dates.get(line);
        if (!previous || date > previous) dates.set(line, date);
      }
    }
    // Local previews must also reflect staged, unstaged, and newly written content.
    const dirty = [
      ...git(["diff", "--name-only", "HEAD", "--", "src"]).split("\n"),
      ...git(["ls-files", "--others", "--exclude-standard", "--", "src"]).split("\n")
    ];
    for (const file of dirty.filter(Boolean)) {
      const absolute = resolve(root, file);
      if (existsSync(absolute)) dates.set(file, statSync(absolute).mtime.toISOString().slice(0, 10));
    }
  } catch {
    // Archives without Git history omit optional lastmod rather than inventing it.
    return (_files: string[]): string | undefined => undefined;
  }

  function imports(file: string): string[] {
    const cached = dependencies.get(file);
    if (cached) return cached;
    const result = [file];
    dependencies.set(file, result);
    if (!/\.(astro|tsx?|jsx?)$/.test(file)) return result;
    const absolute = resolve(root, file);
    if (!existsSync(absolute)) return result;
    const source = readFileSync(absolute, "utf8");
    for (const match of source.matchAll(/\b(?:import|export)\s+(?:[^;"']*?\sfrom\s*)?["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith(".") && !specifier.startsWith("@/")) continue;
      const target = specifier.startsWith("@/") ? resolve(root, "src", specifier.slice(2)) : resolve(dirname(absolute), specifier);
      const found = [target, ...[".ts", ".tsx", ".js", ".json", ".astro", "/index.ts", "/index.tsx"].map((extension) => target + extension)]
        .find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
      if (found) result.push(...imports(relative(root, found)));
    }
    return result;
  }

  return (files: string[]): string | undefined => {
    const candidates = files.flatMap(imports).flatMap((file) => {
      // Collection pages depend on whole data directories; detail pages pass records.
      if (!file.endsWith("/")) return dates.get(file) ? [dates.get(file)!] : [];
      return [...dates].filter(([path]) => path.startsWith(file)).map(([, date]) => date);
    });
    return candidates.sort().at(-1);
  };
}
