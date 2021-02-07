import ApiClient from './index';
import { decodeToken } from 'react-jwt';

export interface IRole {
  id: number;
  createdAt: string;
  updatedAt: string;
  roleName: string;
}

export interface IUser {
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  id: number;
  roles: IRole[];
}

export interface ILoginResponse {
  token: string;
}

type IDecodedToken = Pick<IUser, 'id' | 'username'>;

interface IRegisterOptions {
  username: string;
  email: string;
  password: string;
  roles: Omit<IRole, 'createdAt' | 'updatedAt' | 'id'>[];
}

export default class UserApiClient extends ApiClient {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async login(username: string, password: string): Promise<IUser> {
    const { token } = (await this.axios.post<ILoginResponse>('/api/users/login', { username, password })).data;
    this.saveJwt(token);
    this.axios = this.buildAxios();
    const { id } = decodeToken(token) as IDecodedToken;
    return await this.getUserById(id);
  }

  async getUserById(id: number): Promise<IUser> {
    return (await this.axios.get<IUser>(`/api/users/user/${id}`)).data;
  }

  async register(options: IRegisterOptions): Promise<IUser> {
    const { token } = (await this.axios.post<ILoginResponse>('/api/users/register', options)).data;
    this.saveJwt(token);
    this.buildAxios();
    const { id } = decodeToken(token) as IDecodedToken;
    return await this.getUserById(id);
  }
}
