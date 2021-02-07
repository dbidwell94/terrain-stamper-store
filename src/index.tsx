import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import state from './state';
import theme from './theme';
import './index.css';
import userApi from 'src/api/userApi';
import stampApi from 'src/api/stampApi';

window.api = { userApi: new userApi('http://localhost:1437'), stampApi: new stampApi('http://localhost:1437') };

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
