import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MasterSchema } from './master.entity';
import { MasterController } from './master.controller';
import { MasterService } from './master.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Master', schema: MasterSchema }]),
  ],
  controllers: [MasterController],
  providers: [MasterService],
  exports: [MasterService],
})
export class MasterModule {}
