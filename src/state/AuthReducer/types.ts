import { Action } from 'redux';
import { IUser } from '../../api/userApi';

export enum authTypes {
  SET_AUTH_MODAL_OPEN = 'SET_AUTH_MODAL_OPEN',
  SET_CURRENT_USER = 'SET_CURRENT_USER',
}

export interface IAuthState {
  authModalOpen: boolean;
  currentUser: IUser | null;
}

interface ModalAction extends Action {
  type: authTypes.SET_AUTH_MODAL_OPEN;
  payload: boolean;
}

interface UserAction extends Action {
  type: authTypes.SET_CURRENT_USER;
  payload: IUser | null;
}

export type IAuthAction = ModalAction | UserAction;
