import React from 'react';
import styled from 'styled-components';

interface IStyleProps {
  borderColor?: string;
}

const ButtonContainer = styled.div<IStyleProps>`
  transition: 0.125s ease-in-out all;
  &:hover {
    background: grey;
  }
  &:active {
      background: black;
  }
  button {
    transition: 0.125s ease-in-out all;
    background: transparent;
    border: none;
    outline: none;
    font-size: 2rem;
    width: 100%;
    height: 100%;
    padding: ${({ theme }) => `${theme.global.padding / 3}rem`};
    position: relative;
    display: flex;
    &:hover {
      cursor: pointer;
      color: white;
    }
    span.highlight-right,
    span.highlight-left {
      width: 15%;
      height: 100%;
      position: absolute;
      border: 0.125rem solid ${({ borderColor }) => (borderColor ? borderColor : 'black')};
      top: 0;
    }
    span.highlight-left {
      left: 0;
      border-right: none;
    }
    span.highlight-right {
      left: calc(100% - 15%);
      border-left: none;
    }
  }
`;

interface IProps extends React.HTMLAttributes<HTMLButtonElement> {
  displayText?: string;
}

type IButtonProps = IProps & IStyleProps;

export default function Button(props: IButtonProps) {
  const { displayText, borderColor, ...buttonProps } = props;

  return (
    <ButtonContainer borderColor={borderColor}>
      <button {...buttonProps}>
        <span className='highlight-right' />
        {displayText}
        <span className='highlight-left' />
      </button>
    </ButtonContainer>
  );
}
