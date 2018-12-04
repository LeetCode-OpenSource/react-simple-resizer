import * as React from 'react';
import { Subject, merge, animationFrameScheduler } from 'rxjs';
import { filter, share, observeOn, map } from 'rxjs/operators';
import { omit } from 'lodash';

import {
  BarAction,
  ChildProps,
  ResizerContext,
  SizeRelatedInfo,
} from '../types';
import { ResizerProvider } from '../context';

import { Resizer } from './Resizer';
import { FilterBarActionScanResult, filterBarActionScanResult, scanBarAction } from './operators';
import {
  calculateCoordinateOffset,
  collectSizeRelatedInfo,
  isDisabledResponsive,
  isSolid,
} from './utils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  onResizing?: (director: Resizer) => void;
}

class Container extends React.PureComponent<Props> {
  private readonly childrenProps: ChildProps[] = [];

  private readonly childrenInstance: HTMLElement[] = [];

  private readonly barActions$ = new Subject<BarAction>();

  private readonly sizeRelatedInfoAction$ = new Subject<SizeRelatedInfo>();

  private readonly sizeRelatedInfo$ = merge<SizeRelatedInfo, FilterBarActionScanResult>(
    this.sizeRelatedInfoAction$,
    this.barActions$.pipe(
      scanBarAction({
        calculateOffset: (current, original) =>
          calculateCoordinateOffset(current, original)[this.axis],
        getSizeRelatedInfo: () => this.makeSizeInfos(),
      }),
      filterBarActionScanResult(),
    ),
  ).pipe(
    map((resizeResult) => {
      if (typeof this.props.onResizing === 'function') {
        const resizer = new Resizer(resizeResult);
        this.props.onResizing(resizer);
        return resizer.getResult();
      } else {
        return { ...resizeResult, discard: false };
      }
    }),
    filter(({ discard }) => !discard),
    observeOn(animationFrameScheduler),
    share(),
  );

  private get axis() {
    return this.props.vertical ? 'y' : 'x';
  }

  private get dimension() {
    return this.props.vertical ? 'height' : 'width';
  }

  private get style(): React.CSSProperties {
    return {
      display: 'flex',
      flexDirection: this.props.vertical ? 'column' : 'row',
      ...this.props.style,
    };
  }

  private get renderProps() {
    return omit(this.props, 'vertical', 'onResizing');
  }

  private get contextValue(): ResizerContext {
    return {
      vertical: !!this.props.vertical,
      sizeRelatedInfo$: this.sizeRelatedInfo$,
      createID: this.createID,
      populateInstance: this.populateChildInstance,
      triggerBarAction: this.triggerBarAction,
    };
  }

  componentDidMount() {
    this.refreshSizeInfos();
  }

  render() {
    return (
      <ResizerProvider value={this.contextValue}>
        <div
          {...this.renderProps}
          style={this.style}
          data-is-vertical={this.props.vertical}
        >
          {this.props.children}
        </div>
      </ResizerProvider>
    );
  }

  private triggerBarAction = (action: BarAction) => {
    this.barActions$.next(action);
  };

  private createID = (childProps: ChildProps) => {
    this.childrenProps.push(childProps);
    return this.childrenProps.length - 1;
  };

  private populateChildInstance = (
    id: number,
    ref: React.RefObject<HTMLElement>,
  ) => {
    if (ref.current) {
      this.childrenInstance[id] = ref.current;
    }
  };

  private refreshSizeInfos() {
    this.sizeRelatedInfoAction$.next(this.makeSizeInfos());
  }

  private makeSizeInfos(): SizeRelatedInfo {
    const { collect, getResult } = collectSizeRelatedInfo();

    this.childrenProps.forEach((childProps, index) => {
      const element = this.childrenInstance[index];

      collect({
        maxSize: childProps.maxSize,
        minSize: childProps.minSize,
        disableResponsive: isDisabledResponsive(childProps),
        isSolid: isSolid(childProps),
        currentSize: element.getBoundingClientRect()[this.dimension],
      });
    });

    return getResult();
  }
}

export { Container, Resizer };
