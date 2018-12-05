import * as React from 'react';
import { omit } from 'lodash';

import { BarActionType, ChildProps, Coordinate, ExpandInteractiveArea } from './types';
import { withResizerContext } from './context';

type Props = React.HTMLAttributes<HTMLDivElement> &
  Pick<ChildProps, 'context' | 'size' | 'innerRef'> & {
    expandInteractiveArea?: ExpandInteractiveArea;
    onStatusChanged?: (isActive: boolean) => void;
  };

const DEFAULT_INTERACTIVE_AREA_STYLE: React.CSSProperties = {
  boxSizing: 'content-box',
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: '100%',
  height: '100%',
  transform: 'translate(-50%, -50%)',
};

class BarComponent extends React.PureComponent<Props> {
  private readonly defaultInnerRef = React.createRef<HTMLDivElement>();

  private readonly id = this.props.context.createID(this.props);

  private isValidClick: boolean = true;

  private get ref() {
    return this.props.innerRef || this.defaultInnerRef;
  }

  private get containerStyle(): React.CSSProperties {
    return {
      position: 'relative',
      flex: `0 0 ${this.props.size || 10}px`,
      ...this.props.style,
    };
  }

  private get interactiveAreaStyle() {
    const { expandInteractiveArea } = this.props;

    if (expandInteractiveArea) {
      const {
        top = 0,
        left = 0,
        right = 0,
        bottom = 0,
      } = expandInteractiveArea;

      return {
        ...DEFAULT_INTERACTIVE_AREA_STYLE,
        padding: `${top}px ${right}px ${bottom}px ${left}px`,
      };
    } else {
      return DEFAULT_INTERACTIVE_AREA_STYLE;
    }
  }

  private get renderProps() {
    return omit(
      this.props,
      'expandInteractiveArea',
      'onStatusChanged',
      'children',
      'onClick',
      // ChildProps
      'innerRef',
      'context',
      'size',
    );
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
    return (
      <div {...this.renderProps} ref={this.ref} style={this.containerStyle}>
        {this.props.children}
        <div
          style={this.interactiveAreaStyle}
          onClick={this.onClick}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onTouchStart}
        />
      </div>
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
     *   - disable user select if resizing
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
    this.updateStatusIfNeed(type);
    this.updateClickStatus(type);
  }

  private triggerMouseAction(type: BarActionType) {
    return (event: React.MouseEvent | MouseEvent) => {
      const { clientX: x, clientY: y } = event;
      this.triggerAction(type, { x, y });
    };
  }

  private triggerTouchAction(type: BarActionType) {
    return (event: React.TouchEvent | TouchEvent) => {
      const touch = event.touches[0] || { clientX: 0, clientY: 0 };
      const { clientX: x, clientY: y } = touch;
      this.triggerAction(type, { x, y });
    };
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

  private onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (this.isValidClick && typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  };
}

export const Bar = withResizerContext(BarComponent);
