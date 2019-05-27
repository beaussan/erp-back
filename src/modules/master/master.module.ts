import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterSchema } from './master.entity';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';
import { DB_REF_MASTER } from '../../constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DB_REF_MASTER, schema: MasterSchema }]),
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
