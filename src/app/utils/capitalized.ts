//only use for Names
export const capitalize = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

//use for order type
export const formatType =(value: string): string  => {
  return value
  .split("_")
  .map((string) => string.charAt(0).toUpperCase() + string.slice(1))
  .join(" ")
}