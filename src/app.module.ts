import { Module } from '@nestjs/common';
import { BaseModule } from './base';
import { CommonModule } from './common';

@Module({
  imports: [BaseModule, CommonModule],
})
export class AppModule {}
