/** Anchor id for a guide heading, e.g. "What do RFO and pre-selling mean?" → "what-do-rfo-and-pre-selling-mean". */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Plain text of simple React children (strings, numbers, nested arrays). */
export function childrenText(children: unknown): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return childrenText((children as { props: { children?: unknown } }).props.children);
  }
  return "";
}
