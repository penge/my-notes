const canLog = process.env.LOG_LEVEL !== "SILENT";

export default (message: string, color?: string): void => {
  if (!canLog) {
    return;
  }

  console.log(`%c${message}`, `color: ${color}`);
};
