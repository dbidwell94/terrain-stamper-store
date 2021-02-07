import React from 'react';
import styled from 'styled-components';

const SearchbarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  height: 100%;
  input {
    border: none;
    border-bottom: thin solid black;
    padding: 0rem ${({ theme }) => `${theme.global.padding}rem`};
    width: 100%;
    height: 50%;
    font-size: 2rem;
    &:focus,
    &:active {
      outline: none;
    }
  }
`;

export default function Searchbar() {
  return (
    <SearchbarContainer>
      <label htmlFor='searchbar' hidden>
        Search
      </label>
      <input placeholder='search' id='searchbar' />
    </SearchbarContainer>
  );
}
