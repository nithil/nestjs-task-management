import * as bcrypt from 'bcryptjs';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';

import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;

      const user = this.create();
      user.username = username;
      user.salt = await bcrypt.genSalt();
      user.password = await this.hashPassword(password, user.salt);

      await user.save();
    } catch (error) {
      const duplicateRecordCode = '23505';
      if (error.code === duplicateRecordCode) {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    try {
      const { username, password } = authCredentialsDto;

      const user = await this.findOne({ username });

      if (user && (await user.validatePassword(password))) {
        return user.username;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
