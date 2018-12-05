import * as React from 'react';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { ChildProps, SizeInfo } from './types';
import { withResizerContext } from './context';
import { isValidNumber, omit } from './utils';

type Props = ChildProps &
  React.HTMLAttributes<HTMLDivElement> & {
    onSizeChanged?: (currentSize: number) => void;
  };

class SectionComponent extends React.PureComponent<Props> {
  private readonly defaultInnerRef = React.createRef<HTMLDivElement>();

  private readonly id = this.props.context.createID(this.props);

  private readonly subscription = new Subscription();

  private sizeInfo?: SizeInfo;

  private flexGrowRatio: number = 0;

  private resize$ = this.props.context.sizeRelatedInfo$.pipe(
    map(({ sizeInfoArray, flexGrowRatio }) => ({
      sizeInfo: sizeInfoArray[this.id],
      flexGrowRatio,
    })),
    filter(({ sizeInfo }) => !!sizeInfo),
    tap(({ sizeInfo, flexGrowRatio }) => {
      this.sizeInfo = sizeInfo;
      this.flexGrowRatio = flexGrowRatio;
      if (this.ref.current) {
        const { flexGrow, flexBasis } = this.getStyle(sizeInfo, flexGrowRatio);
        this.ref.current.style.flexBasis = `${flexBasis}px`;
        this.ref.current.style.flexGrow = `${flexGrow}`;
        this.onSizeChanged(sizeInfo.currentSize);
      }
    }),
  );

  private get ref() {
    return this.props.innerRef || this.defaultInnerRef;
  }

  private get flexShrink() {
    if (isValidNumber(this.props.size)) {
      return 0;
    } else {
      return this.props.disableResponsive ? 1 : 0;
    }
  }

  componentDidMount() {
    this.subscription.add(this.resize$.subscribe());
    this.props.context.populateInstance(this.id, this.ref);
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  render() {
    const props = omit(this.props, [
      'innerRef',
      // ChildProps
      'defaultSize',
      'disableResponsive',
      'context',
      'size',
      'minSize',
      'maxSize',
    ]);

    const { vertical } = this.props.context;

    const style: React.CSSProperties = {
      [vertical ? 'maxHeight' : 'maxWidth']: this.props.maxSize,
      [vertical ? 'minHeight' : 'minWidth']: this.props.minSize,
      overflow: 'hidden',
      flexShrink: this.flexShrink,
      ...this.getStyle(),
      ...this.props.style,
    };

    return <div {...props} style={style} ref={this.ref} />;
  }

  private onSizeChanged(currentSize: number) {
    if (typeof this.props.onSizeChanged === 'function') {
      this.props.onSizeChanged(currentSize);
    }
  }

  private getStyle(
    sizeInfo: SizeInfo | undefined = this.sizeInfo,
    flexGrowRatio: number = this.flexGrowRatio,
  ): React.CSSProperties {
    if (sizeInfo) {
      const { disableResponsive, currentSize } = sizeInfo;

      return {
        flexGrow: disableResponsive ? 0 : flexGrowRatio * currentSize,
        flexBasis: disableResponsive ? currentSize : 0,
      };
    } else {
      const size = this.props.size || this.props.defaultSize;
      const isSolid = isValidNumber(size);

      return {
        flexGrow: isSolid ? 0 : 1,
        flexBasis: isSolid ? size : 0,
      };
    }
  }
}

export const Section = withResizerContext(SectionComponent);
