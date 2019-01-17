import styled from '@emotion/styled';

import { ignoreProps } from '../utils';

interface StyledContainerProps {
  vertical?: boolean;
}

const customStyledContainerProps = [
  'vertical',
  'onActivate',
  'beforeApplyResizer',
  'afterResizing',
];

export const StyledContainer = styled('div', {
  shouldForwardProp: ignoreProps(customStyledContainerProps),
})<StyledContainerProps>(({ vertical }) => ({
  display: 'flex',
  flexDirection: vertical ? 'column' : 'row',
}));
