import * as React from 'react';

import {
  BarActionType,
  ChildProps,
  Coordinate,
  ExpandInteractiveArea,
} from '../types';
import { omit } from '../utils';
import { withResizerContext } from '../context';
import { StyledBar, StyledInteractiveArea, StyledBarProps } from './Bar.styled';
import { disablePassive } from './disablePassive';

type Props = React.HTMLAttributes<HTMLDivElement> &
  Pick<ChildProps, 'context' | 'innerRef'> & {
    size: number;
    onClick?: () => void;
    expandInteractiveArea?: ExpandInteractiveArea;
    onStatusChanged?: (isActive: boolean) => void;
  };

class BarComponent extends React.PureComponent<Props> {
  private readonly defaultInnerRef = React.createRef<HTMLDivElement>();

  private readonly interactiveAreaRef = React.createRef<HTMLDivElement>();

  private readonly id = this.props.context.createID(this.props);

  private isValidClick: boolean = true;

  private get ref() {
    return this.props.innerRef || this.defaultInnerRef;
  }

  private get childProps(): StyledBarProps {
    return omit(this.props, [
      'context',
      'innerRef',
      'onClick',
      'expandInteractiveArea',
      'onStatusChanged',
    ]);
  }

  private isActivated: boolean = false;

  private onMouseDown = this.triggerMouseAction(BarActionType.ACTIVATE);
  private onMouseMove = this.triggerMouseAction(BarActionType.MOVE);
  private onMouseUp = this.triggerMouseAction(BarActionType.DEACTIVATE);

  private onTouchStart = this.triggerTouchAction(BarActionType.ACTIVATE);
  private onTouchMove = this.triggerTouchAction(BarActionType.MOVE);
  private onTouchEnd = this.triggerTouchAction(BarActionType.DEACTIVATE);
  private onTouchCancel = this.triggerTouchAction(BarActionType.DEACTIVATE);

  componentDidMount() {
    this.props.context.populateInstance(this.id, this.ref);
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('touchmove', this.onTouchMove, disablePassive);
    document.addEventListener('touchend', this.onTouchEnd);
    document.addEventListener('touchcancel', this.onTouchCancel);

    if (this.interactiveAreaRef.current) {
      this.interactiveAreaRef.current.addEventListener(
        'mousedown',
        this.onMouseDown,
      );
      this.interactiveAreaRef.current.addEventListener(
        'touchstart',
        this.onTouchStart,
        disablePassive,
      );
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('touchmove', this.onTouchMove);
    document.removeEventListener('touchend', this.onTouchEnd);
    document.removeEventListener('touchcancel', this.onTouchCancel);

    if (this.interactiveAreaRef.current) {
      this.interactiveAreaRef.current.removeEventListener(
        'mousedown',
        this.onMouseDown,
      );
      this.interactiveAreaRef.current.removeEventListener(
        'touchstart',
        this.onTouchStart,
      );
    }
  }

  render() {
    return (
      <StyledBar {...this.childProps} ref={this.ref}>
        {this.props.children}
        <StyledInteractiveArea
          {...this.props.expandInteractiveArea}
          ref={this.interactiveAreaRef}
          vertical={this.props.context.vertical}
        />
      </StyledBar>
    );
  }

  private onStatusChanged(isActivated: boolean) {
    if (this.isActivated !== isActivated) {
      this.isActivated = isActivated;

      if (typeof this.props.onStatusChanged === 'function') {
        this.props.onStatusChanged(isActivated);
      }
    }
  }

  private updateStatusIfNeed(type: BarActionType) {
    if (type === BarActionType.ACTIVATE) {
      this.onStatusChanged(true);
    } else if (type === BarActionType.DEACTIVATE) {
      this.onStatusChanged(false);
    }
  }

  private triggerAction(type: BarActionType, coordinate: Coordinate) {
    if (this.isActivated || type === BarActionType.ACTIVATE) {
      this.props.context.triggerBarAction({ type, coordinate, barID: this.id });
    }

    if (this.isActivated && type === BarActionType.DEACTIVATE) {
      // touch and click
      this.onClick();
    }

    this.updateStatusIfNeed(type);
    this.updateClickStatus(type);
  }

  private triggerMouseAction(type: BarActionType) {
    return (event: React.MouseEvent | MouseEvent) => {
      this.disableUserSelectIfResizing(event, type);
      const { clientX: x, clientY: y } = event;
      this.triggerAction(type, { x, y });
    };
  }

  private triggerTouchAction(type: BarActionType) {
    return (event: React.TouchEvent | TouchEvent) => {
      this.disableUserSelectIfResizing(event, type);
      const touch = event.touches[0] || { clientX: 0, clientY: 0 };
      const { clientX: x, clientY: y } = touch;
      this.triggerAction(type, { x, y });
    };
  }

  private disableUserSelectIfResizing(
    event: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent,
    type: BarActionType,
  ) {
    if (this.isActivated || type === BarActionType.ACTIVATE) {
      event.preventDefault();
    }
  }

  private updateClickStatus(type: BarActionType) {
    if (this.isActivated) {
      if (type === BarActionType.ACTIVATE) {
        this.isValidClick = true;
      } else if (type === BarActionType.MOVE) {
        this.isValidClick = false;
      }
    }
  }

  private onClick() {
    if (this.isValidClick && typeof this.props.onClick === 'function') {
      this.isValidClick = false; // avoid trigger twice on mobile.
      this.props.onClick();
    }
  }
}

export type BarProps = Omit<Props, 'context'>;

export const Bar = withResizerContext(BarComponent);
