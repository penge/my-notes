export interface ParsedDate {
  year: string
  month: string
  day: string

  date: string
  time: string
  dateTime: string
}

export default (ISOString: string): ParsedDate | undefined => {
  if (!ISOString) {
    return;
  }

  const dateObject = new Date(ISOString);
  if (isNaN(dateObject.getTime())) {
    return;
  }

  const dateString = dateObject.toLocaleString("en-US", {
    year: "numeric",
    month: "long", // "May", "January"
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  const parts = dateString.split(",").map((part) => part.trim());
  const date = `${parts[1]} ${parts[0]}`; // e.g. "2021 April 4"
  const time = parts[2]; // e.g. "4:03:44 PM"
  const dateTime = `${date}, ${time}`; // e.g. "2021 April 4, 4:03:44 PM"
  const [year, month, day] = date.split(" "); // e.g. ["2021", "April", "4"]

  return { year, month, day, date, time, dateTime };
};
