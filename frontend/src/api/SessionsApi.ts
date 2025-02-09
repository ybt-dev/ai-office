import { ApiClient } from './ApiClient';
import { User } from './UsersApi';

export interface SessionsApi {
  sendSessionLink(email: string): Promise<void>;
  createSession(token: string): Promise<void>;
  getSessionUser(): Promise<User>;
}

export default class SessionsRestApi implements SessionsApi {
  public constructor(private client: ApiClient) {}

  public async sendSessionLink(email: string) {
    await this.client.makeCall(`/sessions/token`, 'POST', {
      email,
    });
  }

  public async createSession(token: string) {
    await this.client.makeCall(`/sessions`, 'POST', {
      token,
    });
  }

  public async getSessionUser() {
    const session = await this.client.makeCall<{
      sessionUser: User | null;
    }>(`/sessions`, 'GET');

    return session.sessionUser;
  }
}
