import ax, { AxiosInstance } from 'axios';

export default abstract class ApiClient {
  private baseUrl: string;
  protected axios: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axios = this.buildAxios();
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
    if (token) {
      return token;
    }
    return null;
  }

  protected deleteJwt(): void {
    localStorage.removeItem('token');
  }

  protected saveJwt(token: string): void {
    localStorage.setItem('token', token);
  }
}
