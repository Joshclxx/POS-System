//use for order type or products name with space
export const formatType =(value: string): string  => {
  return value
  .split(" ")
  .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
  .join(" ")
}