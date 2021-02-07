import ax, { AxiosInstance } from 'axios';
import UserApi from './userApi';
import StampApi from './stampApi';
import { setToken } from '../state/AuthReducer/AuthActions';
import state from '../state';

export default abstract class ApiClient {
  private baseUrl: string;
  protected axios: AxiosInstance;
  protected token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axios = this.buildAxios();
    this.token = this.getJwtFromLocalStorage();
    state.subscribe(() => {
      if (state.getState().authReducer.token !== this.token) {
        this.token = state.getState().authReducer.token;
        this.axios = this.buildAxios();
      }
    });
  }

  protected buildAxios(): AxiosInstance {
    const headers = {} as any;
    if (this.getJwtFromLocalStorage()) {
      headers.authorization = `bearer ${this.getJwtFromLocalStorage()}`;
    }
    return ax.create({ baseURL: this.baseUrl, headers });
  }

  protected getJwtFromLocalStorage(): string | null {
    const token = localStorage.getItem('token');
    state.dispatch(setToken(token));
    return token;
  }

  protected deleteJwt(): void {
    localStorage.removeItem('token');
    state.dispatch(setToken(null));
  }

  protected saveJwt(token: string): void {
    state.dispatch(setToken(token));
    localStorage.setItem('token', token);
  }
}

export interface IGlobalApi {
  userApi: UserApi;
  stampApi: StampApi
}