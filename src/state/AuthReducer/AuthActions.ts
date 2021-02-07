import { authTypes, IAuthAction } from './types';
import { IThunkAction } from '../index';

export function toggleAuthModal(show: boolean): IAuthAction {
  return { type: authTypes.SET_AUTH_MODAL_OPEN, payload: show };
}

export function setToken(token: string | null): IAuthAction {
  return { type: authTypes.SET_TOKEN, payload: token };
}
