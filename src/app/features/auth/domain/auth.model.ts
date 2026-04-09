export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}
