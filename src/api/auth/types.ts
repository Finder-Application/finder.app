export interface RegisterDto {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginGGDto {
  idToken: string;
}

export interface Token {
  expiresIn: number;
  accessToken: string;
}
export interface Me {
  firstName: string;
  lastName: string;
  middleName: string;
  avatar: string;
  email: string;
  phone: string;
  address: string;
  gender: boolean;
  userId: number;
}

export interface AuthResponse {
  user: Me;
  token: Token;
}

export interface AuthErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

export interface ChangePwDto {
  email: string;
  password: string;
  otp: number;
}
