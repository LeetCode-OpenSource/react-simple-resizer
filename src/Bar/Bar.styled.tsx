import * as React from 'react';

import { ExpandInteractiveArea } from '../types';

export type StyledBarProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

export const StyledBar = React.forwardRef<HTMLDivElement, StyledBarProps>(
  ({ size, style, ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      style={{
        position: 'relative',
        flex: `0 0 ${size}px`,
        ...style,
      }}
    />
  ),
);

export type StyledInteractiveAreaProps = React.HTMLAttributes<HTMLDivElement> &
  ExpandInteractiveArea & {
    vertical: boolean;
  };

export const StyledInteractiveArea = React.forwardRef<
  HTMLDivElement,
  StyledInteractiveAreaProps
>(
  (
    { top = 0, right = 0, bottom = 0, left = 0, vertical, style, ...props },
    ref,
  ) => (
    <div
      {...props}
      style={{
        position: 'absolute',
        top: -top,
        left: -left,
        right: -right,
        bottom: -bottom,
        cursor: vertical ? 'row-resize' : 'col-resize',
        WebkitTapHighlightColor: 'transparent',
        userSelect: 'none', // disable ios long press popup
        ...style,
      }}
      ref={ref}
    />
  ),
);
