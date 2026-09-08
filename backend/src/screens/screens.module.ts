import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Screen } from './screen.entity';
import { ScreensService } from './screens.service';
import { ScreensController, ScreensPublicController } from './screens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Screen])],
  providers: [ScreensService],
  controllers: [ScreensController, ScreensPublicController],
})
export class ScreensModule {}
