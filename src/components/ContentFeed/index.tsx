import React, { useEffect } from 'react';
import styled from 'styled-components';

const ContentFeedContainer = styled.div`
  grid-column: 2 / 6;
  grid-row: 2 / 7;
  border: medium solid green;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface IContentFeedProps {
  className?: string;
}

export default function ContentFeed({ className }: IContentFeedProps) {

  return (
    <ContentFeedContainer className={className}>
      <h1>Content Feed</h1>
    </ContentFeedContainer>
  );
}
