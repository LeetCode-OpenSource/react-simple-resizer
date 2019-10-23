import * as React from 'react';
import { Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { ChildProps, SizeInfo } from '../types';
import { withResizerContext } from '../context';
import { isValidNumber, omit } from '../utils';
import { StyledSection, StyledSectionProps } from './Section.styled';

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
        const { flexGrow, flexShrink, flexBasis } = this.getStyle(
          sizeInfo,
          flexGrowRatio,
        );

        this.ref.current.style.flexGrow = `${flexGrow}`;
        this.ref.current.style.flexShrink = `${flexShrink}`;
        this.ref.current.style.flexBasis = `${flexBasis}px`;

        this.onSizeChanged(sizeInfo.currentSize);
      }
    }),
  );

  private get ref() {
    return this.props.innerRef || this.defaultInnerRef;
  }

  private get childProps(): StyledSectionProps {
    return {
      ...omit(this.props, [
        'defaultSize',
        'size',
        'disableResponsive',
        'innerRef',
        'onSizeChanged',
      ]),
      ...this.getStyle(),
    };
  }

  componentDidMount() {
    this.subscription.add(this.resize$.subscribe());
    this.props.context.populateInstance(this.id, this.ref);
  }

  componentWillUnmount(): void {
    this.subscription.unsubscribe();
  }

  render() {
    return <StyledSection {...this.childProps} ref={this.ref} />;
  }

  private onSizeChanged(currentSize: number) {
    if (typeof this.props.onSizeChanged === 'function') {
      this.props.onSizeChanged(currentSize);
    }
  }

  private getFlexShrink() {
    if (isValidNumber(this.props.size)) {
      return 0;
    } else {
      return this.props.disableResponsive ? 1 : 0;
    }
  }

  private getStyle(
    sizeInfo: SizeInfo | undefined = this.sizeInfo,
    flexGrowRatio: number = this.flexGrowRatio,
  ) {
    const flexShrink = this.getFlexShrink();

    if (sizeInfo) {
      const { disableResponsive, currentSize } = sizeInfo;

      return {
        flexShrink,
        flexGrow: disableResponsive ? 0 : flexGrowRatio * currentSize,
        flexBasis: disableResponsive ? currentSize : 0,
      };
    } else {
      const size = this.props.size || this.props.defaultSize;

      if (isValidNumber(size)) {
        return {
          flexShrink,
          flexGrow: 0,
          flexBasis: size,
        };
      } else {
        return {
          flexShrink,
          flexGrow: 1,
          flexBasis: 0,
        };
      }
    }
  }
}

export type SectionProps = Pick<Props, 'context'>;

export const Section = withResizerContext(SectionComponent);
