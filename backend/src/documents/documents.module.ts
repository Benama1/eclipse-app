import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { DocumentEntity } from './document.entity';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentsStorage } from './documents.storage';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentEntity]),
    MulterModule.register({ limits: { fileSize: 25 * 1024 * 1024 } }), // 25 Mo max
  ],
  providers: [DocumentsService, DocumentsStorage],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
