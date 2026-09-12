export type Errors<T> = Partial<Record<keyof T, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allows digits with common separators (spaces, dashes, dots, parens, a leading +),
// but requires 7-13 actual digits so strings like "-------" can't slip through.
const PHONE_CHARS_RE = /^[0-9+()\-.\s]+$/;
const PHONE_DIGITS_RE = /^\d{7,13}$/;

export function required(value: string, label: string): string | null {
  return value.trim() === "" ? `${label} is required.` : null;
}

export function validEmail(value: string): string | null {
  if (value.trim() === "") return "Email is required.";
  return EMAIL_RE.test(value) ? null : "Enter a valid email address.";
}

export function validPhone(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return "Phone number is required.";
  if (!PHONE_CHARS_RE.test(trimmed)) return "Enter a valid phone number.";
  const digitsOnly = trimmed.replace(/\D/g, "");
  return PHONE_DIGITS_RE.test(digitsOnly) ? null : "Enter a valid phone number.";
}
