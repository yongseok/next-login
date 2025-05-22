import { userRepository } from '../database/user.repository';
import bcrypt from 'bcrypt';
import {
  UserNotFoundError,
  UserOAuthError,
  UserPasswordMismatchError,
} from '../errors/userErrors';

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
      throw new UserNotFoundError();
    }

    if (!findUser.password) {
      throw new UserOAuthError();
    }

    const isPasswordValid = await bcrypt.compare(
      user.password,
      findUser.password as string
    );

    if (!isPasswordValid) {
      throw new UserPasswordMismatchError();
    }
  }
}

export const userService = new UserService();
