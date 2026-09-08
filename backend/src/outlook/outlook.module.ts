import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutlookConfig } from './outlook-config.entity';
import { OutlookService } from './outlook.service';
import { OutlookController, OutlookCallbackController } from './outlook.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OutlookConfig])],
  providers: [OutlookService],
  controllers: [OutlookController, OutlookCallbackController],
})
export class OutlookModule {}
