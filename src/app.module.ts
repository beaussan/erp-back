import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerModule } from './modules/core/logger/logger.module';
import { RouterModule } from 'nest-router';
import { appRoutes } from './app.routes';
import { ConfigModule } from './modules/core/config/config.module';
import { RolesGuard } from './guards/roles.guard';
import { UserModule } from './modules/user/user.module';
import { ConfigService } from './modules/core/config/config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AuthModule } from './modules/core/auth/auth.module';
import { PromModule } from './modules/core/metrics/metrics.module';
import { InboundMiddleware } from './modules/core/metrics/middleware/inbound.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { MapperModule } from './modules/core/mapper/mapper.module';
import { MasterModule } from './modules/master/master.module';
// needle-module-import

@Module({
  imports: [
    ConfigModule, // Global
    MapperModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongodbUrl,
        useNewUrlParser: true,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    PromModule.forRoot({
      defaultLabels: {
        app: 'v1.0.0',
      },
    }),
    LoggerModule, // Global
    RouterModule.forRoutes(appRoutes),
    AuthModule,
    UserModule,
    MasterModule,
    // needle-module-includes
  ],
  controllers: [AppController],
  providers: [RolesGuard, ClassSerializerInterceptor],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(InboundMiddleware).forRoutes('*');
  }
}
