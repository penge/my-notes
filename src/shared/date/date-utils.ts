import formatDate from "./format-date";

const now = (): string => new Date().toISOString();

const getCurrentDate = (): string => formatDate(now()).split(",")[0].trim();
const getCurrentTime = (): string => formatDate(now()).split(",")[1].trim();
const getCurrentDateAndTime = (): string => formatDate(now());

export default {
  getCurrentDate,
  getCurrentTime,
  getCurrentDateAndTime,
};
