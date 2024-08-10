import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MONGODB, POSTGRES } from '../libs/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = configService.get<string>('DB_TYPE');
        let database: TypeOrmModuleOptions | Promise<TypeOrmModuleOptions>;
        switch (type) {
          case MONGODB:
            database = {
              type: 'mongodb',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              entities: ['./**/*.entity.js'],
              useUnifiedTopology: true,
              logging: true,
            };
            break;
          case POSTGRES:
            database = {
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              entities: ['./**/*.entity.js'],
              migrations: ['./**/*.migration.js'],
              extra: {
                connectionLimit: 10,
              },
            };
            break;
          default:
            database = {
              type: 'mysql',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              autoLoadEntities: true,
              entities: ['./**/*.entity.js'],
              migrations: ['./**/*.migration.js'],
            };
        }
        return database;
      },
    }),
  ],
})
export class DatabaseModule {}
