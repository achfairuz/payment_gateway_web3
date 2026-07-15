import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export interface ApiCredentials {
  apiKey: string;
  rawSecretKey: string;
  hashedSecretKey: string;
}

export class ApiCredentialsHelper {
  static async generate(): Promise<ApiCredentials> {
    const apiKey = `pk_live_${randomBytes(24).toString('hex')}`;
    const rawSecretKey = `sk_live_${randomBytes(32).toString('hex')}`;
    const hashedSecretKey = await bcrypt.hash(rawSecretKey, SALT_ROUNDS);

    return { apiKey, rawSecretKey, hashedSecretKey };
  }
}
