export default function debounce<Params extends unknown[]>(
  func: (...args: Params) => unknown,
  timeout: number,
): (...args: Params) => void {
  let timer: number;
  return (...args: Params) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, timeout);
  };
}
