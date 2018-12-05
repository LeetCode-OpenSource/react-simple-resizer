export function isValidNumber(num?: number): num is number {
  return typeof num === 'number' && num === num;
}

export function omit<T extends { [key in string]: any }>(
  obj: T,
  paths: string[],
): T {
  const newObj = {} as T;

  Object.keys(obj)
    .filter((path) => paths.indexOf(path) === -1)
    .forEach((path) => {
      newObj[path] = obj[path];
    });

  return newObj;
}

export function noop() {}
