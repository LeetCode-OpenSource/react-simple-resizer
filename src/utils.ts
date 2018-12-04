import { isFinite as _isFinite } from 'lodash';

export function isValidNumber(num?: number): num is number {
  return _isFinite(num);
}
