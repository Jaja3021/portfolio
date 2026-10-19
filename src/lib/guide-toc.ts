import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { headingId } from "./heading-id";

export interface TocItem {
  id: string;
  title: string;
}

/** "## " headings of a guide's MDX file, for the "On this page" list. */
export async function guideToc(slug: string): Promise<TocItem[]> {
  const file = path.join(process.cwd(), "src", "content", "guides", `${slug}.mdx`);
  const source = await readFile(file, "utf8").catch(() => "");
  return [...source.matchAll(/^## (.+)$/gm)].map((m) => {
    const title = m[1].trim();
    return { id: headingId(title), title };
  });
}
