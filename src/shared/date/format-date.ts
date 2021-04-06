import parseDate from "./parse-date";

export enum FormatDateOption {
  ONLY_TIME,
  ONLY_DATE
}

export default (ISOString: string, option?: FormatDateOption): string => {
  const parsed = parseDate(ISOString);
  if (!parsed) {
    return "";
  }

  if (option === FormatDateOption.ONLY_DATE) {
    return parsed.date;
  }

  if (option === FormatDateOption.ONLY_TIME) {
    return parsed.time;
  }

  return parsed.dateTime;
};
