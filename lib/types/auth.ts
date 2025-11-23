export interface AuthInfo {
  id: number;
  username: string;
  avatarType: number;
  timezone: string;
  heart: number;
  totalHeart: number;
  closeness: string;
  isSubscribe: boolean;
  userType: string;
  uuid: string;
  createdAt: string;
  email: string;
  number: string;
  accessToken: string;
  refreshToken: string;
  sendbirdToken: string;
  isExist: boolean;
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
