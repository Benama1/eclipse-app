import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Communication } from './communication.entity';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Communication])],
  providers: [CommunicationsService],
  controllers: [CommunicationsController],
})
export class CommunicationsModule {}
