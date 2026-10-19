/**
 * Splits text into words that each rise out of a mask. Used with
 * data-reveal="words" (on scroll) or the hero's load animation. Screen
 * readers get the plain text from a visually hidden copy.
 */
export function SplitWords({ text, offset = 0, wordClassName = "split-word" }: {
  text: string;
  /** Start index, so a second line continues the first line's stagger. */
  offset?: number;
  wordClassName?: string;
}) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden className={wordClassName}>
          <span style={{ "--i": i + offset } as React.CSSProperties}>{word}</span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </>
  );
}
