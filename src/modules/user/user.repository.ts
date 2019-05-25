import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { Optional } from 'typescript-optional';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async hasUserWithMatchingEmail(email: string): Promise<boolean> {
    return (await this.userModel.countDocuments({ email }).exec()) === 1;
  }

  async findOneWithEmail(email: string): Promise<Optional<User>> {
    return Optional.of(await this.userModel.findOne({ email }).exec());
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<Optional<User>> {
    return Optional.of(await this.userModel.findById(id));
  }
}
