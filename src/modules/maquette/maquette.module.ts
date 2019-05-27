import { Module } from '@nestjs/common';
import { MaquetteController } from './maquette.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DB_REF_MAQUETTE } from '../../constants';
import { MaquetteSchema } from './maquette.entity';
import { MaquetteService } from './maquette.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DB_REF_MAQUETTE, schema: MaquetteSchema },
    ]),
  ],
  controllers: [MaquetteController],
  providers: [MaquetteService],
  exports: [MaquetteService],
})
export class MaquetteModule {}
