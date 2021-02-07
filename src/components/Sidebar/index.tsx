import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  grid-column: 1 / 1;
  grid-row: 1 / 7;
  border: medium solid black;
  display: grid;
  grid-template-rows: repeat(10, 1fr);
  grid-template-columns: 1fr;
`;

export default function Sidebar({ className }: { className?: string }) {
  return <SidebarContainer className={className}></SidebarContainer>;
}
