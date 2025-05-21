import { userRepository } from '../database/user.repository';
import bcrypt from 'bcrypt';

class UserService {
  constructor(private userRepo = userRepository) {}

  async signup(user: { email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await this.userRepo.createUser({
      email: user.email,
      password: hashedPassword,
    });
  }

  async login(user: { email: string; password: string }) {
    const findUser = await this.userRepo.getUserByEmail(user.email);
    if (!findUser) {
      return { success: false, message: '존재하지 않는 사용자입니다.' };
    }
    if (!findUser.password) {
      return { success: false, message: 'OAuth 로그인 사용자입니다.' };
    }
    const isPasswordValid = await bcrypt.compare(
      user.password,
      findUser.password as string
    );
    if (!isPasswordValid) {
      return { success: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    return { success: true, message: '로그인 성공' };
  }
}

export const userService = new UserService();
