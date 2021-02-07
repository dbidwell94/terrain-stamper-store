import React from 'react';
import styled from 'styled-components';
import Button from '../../../sharedComponents/Button';
import Searchbar from './Searchbar';
import { useDispatch, useSelector } from 'react-redux';
import { toggleAuthModal } from '../../../state/AuthReducer/AuthActions';

const SearchbarLoginContainer = styled.div`
  grid-row: 1 / 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem ${({ theme }) => `${theme.global.padding}rem`};
`;

interface ISearchbarLoginProps {
  className?: string;
}

export default function SearchbarLogin({ className }: ISearchbarLoginProps) {
  const dispatch = useDispatch();
  const { authModalOpen } = useSelector((state) => state.authReducer);

  return (
    <SearchbarLoginContainer className={className}>
      <Searchbar />
      <Button displayText='Login' onClick={() => dispatch(toggleAuthModal(!authModalOpen))} />
    </SearchbarLoginContainer>
  );
}
