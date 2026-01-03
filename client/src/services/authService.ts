import api, { type ApiResponse, handleApiError, setAuthTokens, clearAuthTokens } from '../utils/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'employee';
    isFirstLogin: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Auth Service
class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      
      if (response.data.success && response.data.data) {
        const { user, tokens } = response.data.data;
        
        // Store tokens
        setAuthTokens(tokens.accessToken, tokens.refreshToken);
        
        // Store user info
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data.data;
      }
      
      throw new Error(response.data.message || 'Login failed');
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear tokens and user data regardless of API call success
      clearAuthTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await api.post<ApiResponse<{ tokens: { accessToken: string; refreshToken: string } }>>(
        '/auth/refresh-token',
        { refreshToken }
      );
      
      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
        setAuthTokens(accessToken, newRefreshToken);
        return { accessToken, refreshToken: newRefreshToken };
      }
      
      throw new Error('Token refresh failed');
    } catch (error) {
      clearAuthTokens();
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      const response = await api.post<ApiResponse>('/auth/change-password', data);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Password change failed');
      }
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): LoginResponse['user'] | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  /**
   * Check if user is admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }
}

export default new AuthService();
