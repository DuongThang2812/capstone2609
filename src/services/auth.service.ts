import bcrypt from 'bcrypt';
import { AppError } from '../common/app-error.js';
import type { UserRepository } from '../repositories/user.repository.js';
import type { TokenService } from './token.service.js';
import type { RegisterInput, LoginInput } from '../types/dto.js';

export class AuthService {
  constructor(private readonly users: UserRepository, private readonly tokens: TokenService, private readonly rounds: number) {}
  async register(input: RegisterInput) {
    if (await this.users.findCredentials(input.email)) throw new AppError(409, 'Email đã được sử dụng', 'EMAIL_EXISTS');
    const mat_khau = await bcrypt.hash(input.mat_khau, this.rounds);
    return this.users.create({ ...input, mat_khau });
  }
  async login(input: LoginInput) {
    const user = await this.users.findCredentials(input.email);
    if (!user || !await bcrypt.compare(input.mat_khau, user.mat_khau)) {
      throw new AppError(401, 'Email hoặc mật khẩu không chính xác', 'INVALID_CREDENTIALS');
    }
    const { mat_khau: _password, ...safeUser } = user;
    return { accessToken: this.tokens.sign(user.nguoi_dung_id), tokenType: 'Bearer', expiresIn: this.tokens.expiresIn, user: safeUser };
  }
}
