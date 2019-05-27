import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './user.entity';
import { CryptoModule } from '../core/crypto/crypto.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_REF_USRE } from '../../constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DB_REF_USRE, schema: UserSchema }]),
    CryptoModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
