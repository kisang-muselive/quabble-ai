export interface AuthInfo {
  id: number;
  email: string;
  username?: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  username: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignupRequest {
  identifier: string;
  email: string;
  password: string;
  callback: string;
  timezone: string;
  configId: number;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

export interface TokenPayload {
  email?: string;
  userId?: string;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}
