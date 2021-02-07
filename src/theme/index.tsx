import styled, { ThemeProvider } from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}

type ITheme = typeof theme;

const theme = {
  global: {
    padding: 2,
    borderSize: 0.125,
  },
};

export default theme;
