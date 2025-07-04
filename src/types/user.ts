import { User } from '@prisma/client';

export type UserProfileDto = Pick<User, 'id' | 'name' | 'email' | 'role' | 'image'>;
