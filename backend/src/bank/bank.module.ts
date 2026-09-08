import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankConfig } from './bank-config.entity';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankConfig])],
  providers: [BankService],
  controllers: [BankController],
})
export class BankModule {}
