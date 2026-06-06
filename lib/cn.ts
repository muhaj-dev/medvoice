/**
 * cn — NativeWind class name merge utility.
 * Filters falsy values and joins class strings.
 * Use when you need conditional or dynamic className composition.
 *
 * Usage:
 *   className={cn("medv-card", isActive && "border-brand", disabled && "opacity-50")}
 */
export function cn(
  ...classes: (string | undefined | null | false | 0)[]
): string {
  return classes.filter(Boolean).join(" ");
}
