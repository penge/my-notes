export default (ISOString: string): string => {
  if (!ISOString) {
    return "";
  }

  return new Date(ISOString).toLocaleString("en-US", {
    month: "long", // "May"
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  });
};
