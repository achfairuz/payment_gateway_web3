import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import configuration from './config/configuration';
import { CommonModule } from './common/common.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './features/auth/auth.module';
import { MerchantModule } from './features/merchant/merchant.module';
import { InvoiceModule } from './features/invoice/invoice.module';
import { PaymentModule } from './features/payment/payment.module';
import { WalletModule } from './features/wallet/wallet.module';
import { BlockchainModule } from './features/blockchain/blockchain.module';
import { WebhookModule } from './features/webhook/webhook.module';
import { QueueModule } from './features/queue/queue.module';
import { NotificationModule } from './features/notification/notification.module';
import { HealthModule } from './features/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { singleLine: true } }
            : undefined,
        redact: ['req.headers.authorization', 'req.headers["x-api-key"]'],
        autoLogging: true,
        quietReqLogger: true,
      },
    }),
    CommonModule,
    PrismaModule,
    AuthModule,
    MerchantModule,
    InvoiceModule,
    PaymentModule,
    WalletModule,
    BlockchainModule,
    WebhookModule,
    QueueModule,
    NotificationModule,
    HealthModule,
  ],
})
export class AppModule {}
