/**
 * Lightweight class name merger utility without external runtime bloat.
 * Filters falsy values and joins class strings cleanly.
 *
 * @param {...(string | undefined | null | false)} classes
 * @returns {string}
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
