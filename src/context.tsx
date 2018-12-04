import * as React from 'react';
import { noop } from 'lodash';

import { Omit, ChildProps, ResizerContext } from './types';
import { EMPTY } from 'rxjs';

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
      {(context) => <Target {...props} context={context} />}
    </ResizerConsumer>
  );
}
