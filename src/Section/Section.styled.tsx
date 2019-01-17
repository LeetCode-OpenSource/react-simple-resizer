import styled from '@emotion/styled';
import { ChildProps } from '../types';
import { ignoreProps } from '../utils';

interface StyledSectionProps extends ChildProps {
  flexGrow: number;
  flexShrink: number;
  flexBasis: number;
}

const customProps = [
  'onSizeChanged',
  // ChildProps
  'size',
  'defaultSize',
  'maxSize',
  'minSize',
  'context',
  'disableResponsive',
  'innerRef',
  // StyledSectionProps
  'flexGrow',
  'flexShrink',
  'flexBasis',
];

export const StyledSection = styled('div', {
  shouldForwardProp: ignoreProps(customProps),
})<StyledSectionProps>(
  ({ context, maxSize, minSize, flexGrow, flexShrink, flexBasis }) => ({
    overflow: 'hidden',
    [context.vertical ? 'maxHeight' : 'maxWidth']: maxSize,
    [context.vertical ? 'minHeight' : 'minWidth']: minSize,
    flexGrow,
    flexShrink,
    flexBasis,
  }),
);
