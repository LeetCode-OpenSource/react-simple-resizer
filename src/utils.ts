export function isValidNumber(num?: number): num is number {
  return typeof num === 'number' && num === num;
}

export function noop() {}
