import styled from '@emotion/styled';
import { ChildProps } from '../types';

interface StyledSectionProps extends ChildProps {
  flexGrow: number;
  flexShrink: number;
  flexBasis: number;
}

export const StyledSection = styled.div<StyledSectionProps>(
  ({ context, maxSize, minSize, flexGrow, flexShrink, flexBasis }) => ({
    overflow: 'hidden',
    [context.vertical ? 'maxHeight' : 'maxWidth']: maxSize,
    [context.vertical ? 'minHeight' : 'minWidth']: minSize,
    flexGrow,
    flexShrink,
    flexBasis,
  }),
);
