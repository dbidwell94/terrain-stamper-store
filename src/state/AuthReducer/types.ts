import { Action } from 'redux';
import { IUser } from '../../api/userApi';

export enum authTypes {
  SET_AUTH_MODAL_OPEN = 'SET_AUTH_MODAL_OPEN',
  SET_CURRENT_USER = 'SET_CURRENT_USER',
  SET_TOKEN = 'SET_TOKEN',
}

export interface IAuthState {
  authModalOpen: boolean;
  currentUser: IUser | null;
  token: string | null;
}

interface ModalAction extends Action {
  type: authTypes.SET_AUTH_MODAL_OPEN;
  payload: boolean;
}

interface UserAction extends Action {
  type: authTypes.SET_CURRENT_USER;
  payload: IUser | null;
}

interface TokenAction extends Action {
  type: authTypes.SET_TOKEN;
  payload: string | null;
}

export type IAuthAction = ModalAction | UserAction | TokenAction;
