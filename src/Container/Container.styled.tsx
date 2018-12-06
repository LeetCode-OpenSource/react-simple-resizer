import styled from '@emotion/styled';

interface StyledContainerProps {
  vertical?: boolean;
}

export const StyledContainer = styled.div<StyledContainerProps>(
  ({ vertical }) => ({
    display: 'flex',
    flexDirection: vertical ? 'column' : 'row',
  }),
);
