import isPropValid from '@emotion/is-prop-valid';

export function isValidNumber(num?: number): num is number {
  return typeof num === 'number' && num === num;
}

export function noop() {}

export function ignoreProps(ignoreList: string[]) {
  return (propName: string) =>
    ignoreList.indexOf(propName) === -1 && isPropValid(propName);
}
