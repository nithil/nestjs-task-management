import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const { type, host, port, username, password, database, synchronize } = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
};
