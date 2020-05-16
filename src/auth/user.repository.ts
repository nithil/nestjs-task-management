import { Repository, EntityRepository } from 'typeorm';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    try {
      await User.create({ username, password }).save();
    } catch (error) {
      const duplicateRecordCode = '23505';
      if (error.code === duplicateRecordCode) {
        throw new ConflictException(error.detail || 'Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
