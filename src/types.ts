import { RefObject } from 'react';
import { Observable } from 'rxjs';

export interface Coordinate {
  x: number;
  y: number;
}

export type Trend = -1 | 0 | 1;

export enum BarActionType {
  ACTIVATE = 'activate',
  MOVE = 'move',
  DEACTIVATE = 'deactivate',
}

export interface BarAction {
  type: BarActionType;
  coordinate: Coordinate;
  barID: number;
}

export interface SizeInfo {
  isSolid: boolean;
  currentSize: number;
  maxSize?: number;
  minSize?: number;
  disableResponsive?: boolean;
}

export interface SizeRelatedInfo {
  discard?: boolean;
  sizeInfoArray: SizeInfo[];
  flexGrowRatio: number;
}

export interface ChildProps {
  size?: number;
  defaultSize?: number;
  maxSize?: number;
  minSize?: number;
  context: ResizerContext;
  disableResponsive?: boolean;
  innerRef?: RefObject<HTMLDivElement>;
}

export interface ResizerContext {
  vertical: boolean;
  createID: (props: ChildProps) => number;
  populateInstance: (id: number, ref: RefObject<HTMLElement>) => void;
  triggerBarAction: (action: BarAction) => void;
  sizeRelatedInfo$: Observable<SizeRelatedInfo>;
}

export interface ExpandInteractiveArea {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}
