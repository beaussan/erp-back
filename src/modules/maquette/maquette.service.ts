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
import { MasterService } from '../master/master.service';
import * as _ from 'lodash';

const reduceChain = (inArray: any[], keys: string[]) =>
  keys.reduce(
    (prev, curr) =>
      prev.reduce(
        (prev2, curr2) => [...prev2, ...(_.get(curr2, curr) || [])],
        [],
      ),
    inArray,
  );

@Injectable()
export class MaquetteService {
  constructor(
    @InjectModel(DB_REF_MAQUETTE)
    private readonly maquetteModel: Model<Maquette>,
    private readonly masterService: MasterService,
  ) {}

  async saveNew(maquetteCreate: MaquetteDTO): Promise<Maquette> {
    const master = (await this.masterService.findById(
      maquetteCreate.master,
    )).orElseThrow(() => new NotFoundException('Master not found'));
    let maquette = new this.maquetteModel({
      ...maquetteCreate,
    });
    maquette = await maquette.save();
    await master.update({
      maquettes: [...master.maquettes, maquette.id],
    });
    return (await this.findById(maquette.id)).get();
  }

  async updateOne(id: string, maquetteUpdate: MaquetteDTO): Promise<Maquette> {
    let newMaster;
    if (maquetteUpdate.master) {
      newMaster = (await this.masterService.findById(
        maquetteUpdate.master,
      )).orElseThrow(() => new NotFoundException('Master not found'));
    }
    let maquette = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    if (maquette.inProduction) {
      throw new BadRequestException(
        'This maquette is locked since it is used in production',
      );
    }
    if (newMaster && maquette.master !== newMaster.id) {
      newMaster.updateOne({
        maquettes: [...newMaster.maquettes, maquette.id],
      });
      const oldMaster = (await this.masterService.findById(
        maquette.master,
      )).get();
      await oldMaster.update({
        maquettes: oldMaster.maquettes.filter(val => val !== maquette.id),
      });
    }
    maquette = await this.maquetteModel
      .update({ _id: id }, { ...maquetteUpdate })
      .exec();
    return (await this.findById(id)).get();
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
    return (await this.findById(id)).get();
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
    return (await this.findById(id)).get();
  }

  async findById(id: any): Promise<Optional<Maquette>> {
    return Optional.of(
      await this.maquetteModel
        .findById(id)
        .populate('master')
        .exec(),
    );
  }

  async getAll(): Promise<Maquette[]> {
    /*
    const test = await this.maquetteModel
      .find()
      .select('years.semesters.modules.courses')
      .exec();
    console.log(test);
    console.log(reduceChain(test, ['years', 'semesters', 'modules', 'courses']));
     */
    return this.maquetteModel
      .find()
      .populate('master')
      .exec();
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
