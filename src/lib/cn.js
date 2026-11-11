// Joins class names and skips falsy values.
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
