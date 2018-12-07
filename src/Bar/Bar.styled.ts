import styled from '@emotion/styled';

import { ExpandInteractiveArea } from '../types';

interface StyledBarProps {
  size?: number;
}

interface StyledInteractiveAreaProps extends ExpandInteractiveArea {
  vertical: boolean;
}

export const StyledBar = styled.div<StyledBarProps>(({ size = 10 }) => ({
  position: 'relative',
  flex: `0 0 ${size}px`,
}));

export const StyledInteractiveArea = styled.div<StyledInteractiveAreaProps>(
  ({ top = 0, right = 0, bottom = 0, left = 0, vertical }) => ({
    boxSizing: 'content-box',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100%',
    height: '100%',
    transform: 'translate(-50%, -50%)',
    padding: `${top}px ${right}px ${bottom}px ${left}px`,
    cursor: vertical ? 'row-resize' : 'col-resize',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none', // disable ios long press popup
  }),
);
