import { Module, ValidationPipe } from '@nestjs/common';
import { BaseModule } from './base';
import { CommonModule } from './common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [BaseModule, CommonModule],
})
export class AppModule {}
