import { userRepository } from '../database/user.repository';
import bcrypt from 'bcrypt';
import {
  UserNotFoundError,
  UserOAuthError,
  UserPasswordMismatchError,
} from '../errors/userErrors';
import { Role } from '@prisma/client';
import { UserUpdateDto } from '../validations/userUpdateSchema';

class UserService {
  constructor(private userRepo = userRepository) {}

  async signup(user: {
    email: string;
    password?: string;
    name?: string | null;
    role: Role;
  }) {
    const hashedPassword = user.password
      ? await bcrypt.hash(user.password, 10)
      : null;
    await this.userRepo.createUser({
      email: user.email,
      password: hashedPassword,
      name: user.name,
      role: user.role ?? Role.USER,
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
