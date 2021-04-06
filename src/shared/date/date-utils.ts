import formatDate, { FormatDateOption } from "./format-date";

const now = (): string => new Date().toISOString();

const getCurrentDate = (): string => formatDate(now(), FormatDateOption.ONLY_DATE);
const getCurrentTime = (): string => formatDate(now(), FormatDateOption.ONLY_TIME);
const getCurrentDateAndTime = (): string => formatDate(now());

export default {
  getCurrentDate,
  getCurrentTime,
  getCurrentDateAndTime,
};
