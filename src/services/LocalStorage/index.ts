import {get, set, remove} from 'local-storage';
export interface LocalStorageState {
  token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_at: number;
  refresh_token_header: string;
  firstName: string;
  login: boolean;
  models: string;
  c_and_i_active_windows: string;
}

export interface TokenData {
  token?: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_at: number;
  refresh_token_header?: string;
  firstName?: string;
  login?: boolean;
  user?: {
    firstName: string;
  };
  email: string;
}

export interface TokenSet {
  access_token: string;
  refresh_token: string;
  scope: string;
  id_token: string;
  token_type: string;
  expires_at: number;
  email: string;
}

class LocalStorageService {
  _service: LocalStorageService | undefined = undefined;

  getService(): LocalStorageService {
    if (!this._service) {
      this._service = this;
      return this._service;
    }
    return this._service;
  }
  setToken(data: TokenData): void {
    set<string>('token', data?.access_token);
    set<string>('refresh_token', data?.refresh_token);
    set<string>('scope', data?.scope);
    set<string>('id_token', data?.id_token);
    set<string>('token_type', data?.token_type);
    set<number>('expires_at', data?.expires_at);
    set<string>('email', data?.email);
    if (data.refresh_token_header) set<string>('refresh_token_header', data.refresh_token_header);
    if (data.user) set('firstName', data.user.firstName);
    set<boolean>('login', true);
  }
  getAccessToken(): string {
    return get<string>('token');
  }
  getUserId(): string {
    return get<string>('user_id');
  }
  getRefreshToken(): {refresh_token: string; refresh_token_header: string} {
    return {
      refresh_token: get<string>('refresh_token'),
      refresh_token_header: get<string>('refresh_token_header')
    };
  }
  getTokenSet(): TokenSet {
    return {
      access_token: get<string>('token'),
      refresh_token: get<string>('refresh_token'),
      scope: get<string>('scope'),
      id_token: get<string>('id_token'),
      token_type: get<string>('token_type'),
      expires_at: get<number>('expires_at'),
      email: get<string>('email')
    };
  }
  clearToken(): void {
    // ls.clear();
    remove('token');
    remove('refresh_token');
    remove('scope');
    remove('id_token');
    remove('token_type');
    remove('expires_at');
    remove('refresh_token_header');
    remove('firstName');
    remove('login');
    remove('models');
    remove('email');
  }
  setUserId(userId: string): void {
    set<string>('user_id', userId);
  }
  setActiveWindows(activeWindows: string): void {
    set<string>('c_and_i_active_windows', activeWindows);
  }
  getActiveWindows(): string {
    return get<string>('c_and_i_active_windows');
  }
  clearActiveWindows(): void {
    remove('c_and_i_active_windows');
  }
  isLoggedIn(): boolean {
    return get<boolean>('login');
  }
  setModel(key: string, model: string): void {
    set<string>(key, model);
  }
  getModel(key: string): string {
    return get<string>(key);
  }
}
const localStorageService = new LocalStorageService();
export default localStorageService;
