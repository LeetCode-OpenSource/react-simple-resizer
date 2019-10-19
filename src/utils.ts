export function isValidNumber(num?: number): num is number {
  return typeof num === 'number' && num === num;
}

export function noop() {}

export function omit<P extends object, K extends keyof P>(
  props: P,
  ignoreKeys: K[],
): Omit<P, K> {
  type IgnoreKeyMap = Partial<Record<keyof P, true>>;

  const ignoreKeyMap = ignoreKeys.reduce<IgnoreKeyMap>(
    (map, key) => {
      map[key] = true;
      return map;
    },
    {} as IgnoreKeyMap,
  );

  return (Object.keys(props) as (keyof P)[]).reduce(
    (newProps, key) => {
      if (ignoreKeyMap[key]) {
        return newProps;
      } else {
        newProps[key] = props[key];
        return newProps;
      }
    },
    {} as P,
  );
}
