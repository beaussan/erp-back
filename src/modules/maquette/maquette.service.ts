import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DB_REF_MAQUETTE } from '../../constants';
import { Model } from 'mongoose';
import { Master } from '../master/master.entity';
import { MaquetteDTO } from './maquette.dto';
import { Maquette } from './maquette.entity';
import { Optional } from 'typescript-optional';

@Injectable()
export class MaquetteService {
  constructor(
    @InjectModel(DB_REF_MAQUETTE)
    private readonly maquetteModel: Model<Maquette>,
  ) {}

  async saveNew(maquetteCreate: MaquetteDTO): Promise<Maquette> {
    const master = new this.maquetteModel(maquetteCreate);
    await master.save();
    return master;
  }

  async updateOne(id: string, maquetteUpdate: MaquetteDTO): Promise<Maquette> {
    const maquette = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    if (maquette.inProduction) {
      throw new BadRequestException(
        'This maquette is locked since it is used in production',
      );
    }
    await maquette.update(maquetteUpdate).exec();
    return this.maquetteModel.findById(id).exec();
  }

  async lockById(id: string): Promise<Maquette> {
    const maquette = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await maquette
      .update({
        inProduction: true,
      })
      .exec();
    return this.maquetteModel.findById(id).exec();
  }

  async unlockById(id: string): Promise<Maquette> {
    const maquette = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await maquette
      .update({
        inProduction: false,
      })
      .exec();
    return this.maquetteModel.findById(id).exec();
  }

  async findById(id: string): Promise<Optional<Maquette>> {
    return Optional.of(await this.maquetteModel.findById(id));
  }

  async getAll(): Promise<Maquette[]> {
    return this.maquetteModel.find().exec();
  }

  async deleteOne(id: string): Promise<Maquette> {
    const maquette = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    if (maquette.inProduction) {
      throw new BadRequestException(
        'This maquette is locked since it is used in production',
      );
    }
    await this.maquetteModel.findByIdAndDelete(id).exec();
    return maquette;
  }
}
