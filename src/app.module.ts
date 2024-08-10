import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/databases/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
