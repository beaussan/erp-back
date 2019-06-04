import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Master } from './master.entity';
import { Optional } from 'typescript-optional';
import { MasterCreateDto } from './master.dto';
import { DB_REF_MASTER } from '../../constants';

@Injectable()
export class MasterService {
  constructor(
    @InjectModel(DB_REF_MASTER) private readonly masterModel: Model<Master>,
  ) {}

  async saveNew(masterCreate: MasterCreateDto): Promise<Master> {
    const master = new this.masterModel({
      name: masterCreate.name,
      description: masterCreate.description,
    });
    return await master.save();
  }

  async updateOne(id: string, masterUpdate: MasterCreateDto): Promise<Master> {
    const masterFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await masterFound.update({
      name: masterFound.name,
      description: masterFound.description,
    });
    return masterFound;
  }

  async getAll(): Promise<Master[]> {
    return this.masterModel.find().exec();
  }

  async getOneById(id: string): Promise<Optional<Master>> {
    return Optional.of(await this.masterModel.findById(id));
  }

  async findById(id: any): Promise<Optional<Master>> {
    return Optional.of(await this.masterModel.findById(id));
  }

  async deleteById(id: string): Promise<void> {
    const masterFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await this.masterModel.findByIdAndDelete(masterFound.id);
  }
}
