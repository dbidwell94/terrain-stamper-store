import { combineReducers, applyMiddleware, createStore, Action, Middleware } from 'redux';
import 'react-redux';
import { ThunkAction } from 'redux-thunk';
import authReducer from './AuthReducer/AuthReducer';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

const globalState = combineReducers({ authReducer });

export type IGlobalState = ReturnType<typeof globalState>;

declare module 'react-redux' {
  export interface DefaultRootState extends IGlobalState {}
}

export type IThunkAction<T extends Action> = ThunkAction<void, IGlobalState, null, T>;

const middlewares: Middleware[] = [thunk];
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

export default createStore(globalState, applyMiddleware(...middlewares));
