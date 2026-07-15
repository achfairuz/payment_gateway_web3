import { randomBytes } from 'crypto';

export interface ApiCredentials {
  apiKey: string;
  secretKey: string;
}

export class ApiCredentialsHelper {
  static generate(): ApiCredentials {
    const apiKey = `pk_live_${randomBytes(24).toString('hex')}`;
    const secretKey = `sk_live_${randomBytes(32).toString('hex')}`;

    return { apiKey, secretKey };
  }
}
