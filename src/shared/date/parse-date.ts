const locale = "en-US";

const monthOptions: Intl.DateTimeFormatOptions = {
  month: "long",
};

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
};

export interface ParsedDate {
  year: number
  month: string
  day: number

  date: string
  time: string
  dateTime: string
}

export default (ISOString: string): ParsedDate | undefined => {
  if (!ISOString) {
    return undefined;
  }

  const dateObject = new Date(ISOString);
  if (Number.isNaN(dateObject.getTime())) {
    return undefined;
  }

  const year = dateObject.getFullYear();
  const month = dateObject.toLocaleString(locale, monthOptions);
  const day = dateObject.getDate();

  const date = `${year} ${month} ${day}`;
  const time = dateObject.toLocaleString(locale, timeOptions);
  const dateTime = `${date}, ${time}`;

  return {
    year,
    month,
    day,

    date,
    time,
    dateTime,
  };
};
