export function debounce<
  ArgType extends unknown[],
  ReturnType,
>(
  callback: (...args: ArgType) => ReturnType,
  delay = 300,
) {
  let timeoutId: NodeJS.Timeout;
  return (...args: ArgType) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
