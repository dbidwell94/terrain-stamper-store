import React from 'react';
import styled from 'styled-components';
import SearchbarLogin from './SearchbarLogin';

const FilterBarContainer = styled.div`
  grid-column: 2 / 6;
  grid-row: 1 / 1;
  border: medium solid red;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  .filter {
    grid-row: 2 / 1;
  }
`;

interface IFilterBarProps {
  className?: string;
}

export default function FilterBar({ className }: IFilterBarProps) {
  return (
    <FilterBarContainer className={className}>
      <SearchbarLogin />
    </FilterBarContainer>
  );
}
