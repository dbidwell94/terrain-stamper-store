import { IAuthState, IAuthAction, authTypes } from './types';

const initialState: IAuthState = {
  authModalOpen: false,
  currentUser: null,
};

export default function (state = initialState, action: IAuthAction): IAuthState {
  switch (action.type) {
    case authTypes.SET_AUTH_MODAL_OPEN:
      return { ...state, authModalOpen: action.payload };

    case authTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };

    default:
      return state;
  }
}
