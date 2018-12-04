import { filter, scan } from 'rxjs/operators';

import {
  BarAction,
  BarActionType,
  Coordinate,
  SizeInfo,
  SizeRelatedInfo,
} from '../types';
import { DEFAULT_COORDINATE_OFFSET, getNextSizeRelatedInfo } from './utils';

export type BarActionScanResult = Pick<SizeRelatedInfo, 'flexGrowRatio'> & {
  barID: number;
  offset: number;
  type: BarActionType;
  originalCoordinate: Coordinate;
  defaultSizeInfoArray: SizeInfo[] | null;
  sizeInfoArray: SizeInfo[] | null;
};

export interface FilterBarActionScanResult extends BarActionScanResult {
  sizeInfoArray: SizeInfo[];
  defaultSizeInfoArray: SizeInfo[];
}

interface ScanBarActionConfig {
  getSizeRelatedInfo: () => SizeRelatedInfo;
  calculateOffset: (current: Coordinate, original: Coordinate) => number;
}

const DEFAULT_BAR_ACTION_SCAN_RESULT: BarActionScanResult = {
  barID: -1,
  type: BarActionType.DEACTIVATE,
  originalCoordinate: DEFAULT_COORDINATE_OFFSET,
  defaultSizeInfoArray: null,
  sizeInfoArray: null,
  offset: 0,
  flexGrowRatio: 0,
};

export function scanBarAction(config: ScanBarActionConfig) {
  return scan<BarAction, BarActionScanResult>((prevResult, action) => {
    const result = {
      barID: action.barID,
      type: action.type,
    };

    switch (action.type) {
      case BarActionType.ACTIVATE:
        const { sizeInfoArray, flexGrowRatio } = config.getSizeRelatedInfo();

        return {
          ...DEFAULT_BAR_ACTION_SCAN_RESULT,
          ...result,
          originalCoordinate: action.coordinate,
          defaultSizeInfoArray: sizeInfoArray,
          sizeInfoArray,
          flexGrowRatio,
        };
      case BarActionType.MOVE:
        const offset = config.calculateOffset(
          action.coordinate,
          prevResult.originalCoordinate,
        );

        return {
          ...result,
          ...getNextSizeRelatedInfo(
            action.barID,
            offset,
            prevResult.defaultSizeInfoArray!,
          ),
          offset,
          originalCoordinate: prevResult.originalCoordinate,
          defaultSizeInfoArray: prevResult.defaultSizeInfoArray,
        };
      case BarActionType.DEACTIVATE:
        return DEFAULT_BAR_ACTION_SCAN_RESULT;
    }
  }, DEFAULT_BAR_ACTION_SCAN_RESULT);
}

export function filterBarActionScanResult() {
  return filter<BarActionScanResult, FilterBarActionScanResult>(
    (
      scanResult: BarActionScanResult,
    ): scanResult is FilterBarActionScanResult =>
      !!(scanResult.flexGrowRatio && scanResult.sizeInfoArray),
  );
}
