import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from './users/user.entity';
import { Meeting } from './meetings/meeting.entity';
import { Offer } from './offers/offer.entity';
import { Communication } from './communications/communication.entity';
import { Screen } from './screens/screen.entity';
import { Transaction } from './payments/transaction.entity';
import { Contribution } from './payments/contribution.entity';
import { SavingsConfig } from './payments/savings.entity';
import { DocumentEntity } from './documents/document.entity';
import { BankConfig } from './bank/bank-config.entity';
import { OutlookConfig } from './outlook/outlook-config.entity';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MeetingsModule } from './meetings/meetings.module';
import { OffersModule } from './offers/offers.module';
import { CommunicationsModule } from './communications/communications.module';
import { ScreensModule } from './screens/screens.module';
import { PaymentsModule } from './payments/payments.module';
import { DocumentsModule } from './documents/documents.module';
import { BankModule } from './bank/bank.module';
import { OutlookModule } from './outlook/outlook.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // --- PostgreSQL : données principales (cahier des charges) ---
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      username: process.env.POSTGRES_USER || 'eclipse',
      password: process.env.POSTGRES_PASSWORD || 'eclipse',
      database: process.env.POSTGRES_DB || 'eclipse',
      entities: [
        User, Meeting, Offer, Communication, Screen, Transaction, Contribution,
        SavingsConfig, DocumentEntity, BankConfig, OutlookConfig,
      ],
      synchronize: true, // ⚠️ pratique en développement — remplacer par des migrations en production
    }),

    // --- MongoDB : système de chat (cahier des charges) ---
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/eclipse_chat'),

    UsersModule,
    AuthModule,
    MeetingsModule,
    OffersModule,
    CommunicationsModule,
    ScreensModule,
    PaymentsModule,
    DocumentsModule,
    BankModule,
    OutlookModule,
    ChatModule,
  ],
})
export class AppModule {}
