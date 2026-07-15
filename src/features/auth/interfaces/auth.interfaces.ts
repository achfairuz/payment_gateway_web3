import { Request } from 'express';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResult extends AuthTokens {
  merchant: {
    apiKey: string;
    secretKey: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user: { id: string; email: string; role: string };
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

export interface JwtRefreshPayload extends JwtPayload {
  refreshToken: string;
}
