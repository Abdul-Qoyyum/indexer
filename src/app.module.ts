import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DatabaseModule } from './modules/databases/database.module';
import { LibsModule } from './modules/libs/libs.module';
import { ApiModule } from './modules/api/api.module';
import { CronModule } from './console/console.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    LibsModule,
    DatabaseModule,
    ApiModule,
    CronModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
