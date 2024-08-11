import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { POSTGRES } from '../libs/constants';

config();

const configService = new ConfigService();

let datasource;

const type = configService.get<string>('DB_TYPE');

switch (type) {
  case POSTGRES:
    datasource = new DataSource({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: ['../**/*.entity.js'],
      migrations: ['../**/*.migration.js'],
    });
    break;
  default:
    datasource = new DataSource({
      type: 'mysql',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      entities: ['../**/*.entity.js'],
      migrations: ['../**/*.migration.js'],
    });
}

export default datasource;
