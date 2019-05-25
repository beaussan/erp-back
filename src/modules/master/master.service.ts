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

@Injectable()
export class MasterService {
  constructor(
    @InjectModel('Master') private readonly masterModel: Model<Master>,
  ) {}

  async getAll(): Promise<Master[]> {
    return this.masterModel.find().exec();
  }

  async getOneById(id: string): Promise<Optional<Master>> {
    return Optional.of(await this.masterModel.findById(id));
  }

  async findById(id: string): Promise<Optional<Master>> {
    return Optional.of(await this.masterModel.findById(id));
  }

  async deleteById(id: string): Promise<void> {
    const masterFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await this.masterModel.findByIdAndDelete(masterFound.id);
  }
}
