import * as React from 'react';

export type StyledContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  vertical?: boolean;
};

export const StyledContainer = React.forwardRef<
  HTMLDivElement,
  StyledContainerProps
>(({ vertical, style, ...props }, ref) => (
  <div
    {...props}
    ref={ref}
    style={{
      display: 'flex',
      flexDirection: vertical ? 'column' : 'row',
      ...style,
    }}
  />
));
