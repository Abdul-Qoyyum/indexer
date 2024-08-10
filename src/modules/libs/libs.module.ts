import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HttpService } from './http';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class LibsModule {}
