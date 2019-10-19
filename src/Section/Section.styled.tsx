import * as React from 'react';

import { ChildProps } from '../types';

export type StyledSectionProps = React.HTMLAttributes<HTMLDivElement> &
  Pick<ChildProps, 'context' | 'maxSize' | 'minSize'> & {
    flexGrow: number;
    flexShrink: number;
    flexBasis: number;
  };

export const StyledSection = React.forwardRef<
  HTMLDivElement,
  StyledSectionProps
>(
  (
    {
      context,
      maxSize,
      minSize,
      flexGrow,
      flexShrink,
      flexBasis,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      {...props}
      ref={ref}
      style={{
        overflow: 'hidden',
        [context.vertical ? 'maxHeight' : 'maxWidth']: maxSize,
        [context.vertical ? 'minHeight' : 'minWidth']: minSize,
        flexGrow,
        flexShrink,
        flexBasis,
        ...style,
      }}
    />
  ),
);
