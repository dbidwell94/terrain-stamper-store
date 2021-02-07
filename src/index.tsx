import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import state from './state';
import theme from './theme';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={state}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
