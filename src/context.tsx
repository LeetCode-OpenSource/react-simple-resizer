import * as React from 'react';
import { EMPTY } from 'rxjs';

import { ChildProps, ResizerContext } from './types';
import { noop } from './utils';

export const {
  Provider: ResizerProvider,
  Consumer: ResizerConsumer,
} = React.createContext<ResizerContext>({
  createID: () => -1,
  populateInstance: noop,
  triggerBarAction: noop,
  vertical: false,
  sizeRelatedInfo$: EMPTY,
});

export function withResizerContext<T extends ChildProps>(
  Target: React.ComponentType<T>,
) {
  return (props: Omit<T, 'context'>) => (
    <ResizerConsumer>
      {(context) => {
        const finalProps = { ...props, context } as T;
        return <Target {...finalProps} />;
      }}
    </ResizerConsumer>
  );
}
