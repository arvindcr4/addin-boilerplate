import { gql } from '../../Scripts/spellbook-api.js';
import { mockAuthService } from './mockService';

interface LoginResponse {
  login: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
}

const USE_MOCK = false; // Set to true to use mock data

class AuthService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('spellbook-token');
  }

  async login(email: string, password: string) {
    if (USE_MOCK) {
      return mockAuthService.login(email, password);
    }

    const query = `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          user {
            id
            email
            name
          }
          token
        }
      }
    `;

    const response = await gql(query, { email, password }) as LoginResponse;
    const { user, token } = response.login;

    this.token = token;
    localStorage.setItem('spellbook-token', token);
    localStorage.setItem('spellbook-user', JSON.stringify(user));

    return user;
  }

  async logout() {
    if (USE_MOCK) {
      return mockAuthService.logout();
    }
    
    this.token = null;
    localStorage.removeItem('spellbook-token');
    localStorage.removeItem('spellbook-user');
  }

  async getCurrentUser() {
    if (USE_MOCK) {
      return mockAuthService.getCurrentUser();
    }

    const cachedUser = localStorage.getItem('spellbook-user');
    if (cachedUser && this.token) {
      return JSON.parse(cachedUser);
    }

    if (!this.token) {
      throw new Error('No authentication token');
    }

    const query = `
      query GetCurrentUser {
        currentUser {
          id
          email
          name
        }
      }
    `;

    const response = await gql(query);
    const user = response.currentUser;
    
    if (user) {
      localStorage.setItem('spellbook-user', JSON.stringify(user));
    }
    
    return user;
  }

  async refreshToken() {
    if (USE_MOCK) {
      return mockAuthService.refreshToken();
    }

    const query = `
      mutation RefreshToken {
        refreshToken {
          token
        }
      }
    `;

    const response = await gql(query);
    const { token } = response.refreshToken;
    
    this.token = token;
    localStorage.setItem('spellbook-token', token);
  }

  getToken() {
    return this.token;
  }
}

export const authService = new AuthService();