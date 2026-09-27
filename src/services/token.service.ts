import jwt from 'jsonwebtoken';
import { AppError } from '../common/app-error.js';

export class TokenService {
  constructor(private readonly secret: string, readonly expiresIn: number) {}
  sign(userId: number): string {
    return jwt.sign({}, this.secret, { algorithm: 'HS256', subject: String(userId), expiresIn: this.expiresIn,
      issuer: 'capstone2609', audience: 'capstone2609-api' });
  }
  verify(token: string): number {
    try {
      const payload = jwt.verify(token, this.secret, { algorithms: ['HS256'], issuer: 'capstone2609', audience: 'capstone2609-api' });
      if (typeof payload === 'string' || !payload.sub || !/^\d+$/.test(payload.sub)) throw new Error('Invalid subject');
      const id = Number(payload.sub);
      if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647) throw new Error('Invalid subject');
      return id;
    } catch {
      throw new AppError(401, 'Token không hợp lệ hoặc đã hết hạn', 'INVALID_TOKEN');
    }
  }
}
