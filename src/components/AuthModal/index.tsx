import React from 'react';
import styled from 'styled-components';

const AuthContainer = styled.div`
  position: fixed;
  width: 50rem;
  height: 50rem;
  top: calc(50% - (50rem / 2));
  right: calc(50% - (50rem / 2));
  display: flex;
  justify-content: center;
  align-items: center;
  background: whitesmoke;
  box-shadow: 0rem 0rem 1rem 0rem black;
  text-align: center;
`;

export default function AuthModal() {
  return (
    <AuthContainer>
      <h1>
          Fuck yeah, Nivada. Here is your auth login modal!
      </h1>
    </AuthContainer>
  );
}
