import * as React from 'react';

import {
  BarActionType,
  ChildProps,
  Coordinate,
  ExpandInteractiveArea,
} from '../types';
import { withResizerContext } from '../context';
import { StyledBar, StyledInteractiveArea } from './Bar.styled';

type Props = React.HTMLAttributes<HTMLDivElement> &
  Pick<ChildProps, 'context' | 'innerRef'> & {
    size: number;
    onClick?: () => void;
    expandInteractiveArea?: ExpandInteractiveArea;
    onStatusChanged?: (isActive: boolean) => void;
  };

class BarComponent extends React.PureComponent<Props> {
  private readonly defaultInnerRef = React.createRef<HTMLDivElement>();

  private readonly id = this.props.context.createID(this.props);

  private isValidClick: boolean = true;

  private get ref() {
    return this.props.innerRef || this.defaultInnerRef;
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
    document.addEventListener<'mousemove'>('mousemove', this.onMouseMove);
    document.addEventListener<'mouseup'>('mouseup', this.onMouseUp);
    document.addEventListener<'touchmove'>('touchmove', this.onTouchMove);
    document.addEventListener<'touchend'>('touchend', this.onTouchEnd);
    document.addEventListener<'touchcancel'>('touchcancel', this.onTouchCancel);
  }

  componentWillUnmount() {
    document.removeEventListener<'mousemove'>('mousemove', this.onMouseMove);
    document.removeEventListener<'mouseup'>('mouseup', this.onMouseUp);
    document.removeEventListener<'touchmove'>('touchmove', this.onTouchMove);
    document.removeEventListener<'touchend'>('touchend', this.onTouchEnd);
    document.removeEventListener<'touchcancel'>(
      'touchcancel',
      this.onTouchCancel,
    );
  }

  render() {
    const { onClick: _, ...props } = this.props;

    return (
      <StyledBar {...props} ref={this.ref}>
        {this.props.children}
        <StyledInteractiveArea
          {...this.props.expandInteractiveArea}
          vertical={this.props.context.vertical}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
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
    /*
     * TODO
     *   - disable body scroll if resizing
     * */
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
      /*
       * avoid listening onClick event on Bar. In iOS, there is a unintentional hover effect.
       * also, mock touch event.
       * */
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

export const Bar = withResizerContext(BarComponent);
