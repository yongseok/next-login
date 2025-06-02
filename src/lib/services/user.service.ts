import { userRepository } from '../database/user.repository';
import {
  UserNotFoundError,
  UserOAuthError,
  UserPasswordMismatchError,
} from '../errors/userErrors';
import { Role, User } from '@prisma/client';
import { UserUpdateDto } from '../validations/userUpdateSchema';
import { verifyPassword, hashPassword } from '../password';

class UserService {
  constructor(private userRepo = userRepository) {}

  async signup(user: {
    email: string;
    password?: string;
    name?: string | null;
    role: Role;
  }) {
    const hashedPassword = user.password
      ? await hashPassword(user.password)
      : null;
    await this.userRepo.createUser({
      email: user.email,
      password: hashedPassword,
      name: user.name,
      role: user.role,
    });
  }

  async login(user: { email: string; password: string }): Promise<User> {
    const findUser = await this.userRepo.getUserByEmail(user.email);
    if (!findUser) {
      throw new UserNotFoundError('사용자를 찾을 수 없습니다.', {
        email: user.email,
      });
    }

    if (!findUser.password) {
      throw new UserOAuthError();
    }

    const isPasswordValid = await verifyPassword(
      user.password,
      findUser.password
    );

    if (!isPasswordValid) {
      throw new UserPasswordMismatchError();
    }

    return findUser;
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.getUserByEmail(email);
  }

  async updateUser(user: UserUpdateDto) {
    const findUser = await this.userRepo.getUserByEmail(user.email);
    if (!findUser || !findUser.email) {
      throw new UserNotFoundError();
    }

    return await this.userRepo.updateUser(findUser.email, user);
  }
}

export const userService = new UserService();
