import { User } from './user.entity';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import {  } from './user.constants';
import {
  UserDtoRegister,
  UserDtoUpdateInfo,
  UserDtoUpdatePassword,
} from './user.dto';
import { Optional } from 'typescript-optional';
import { CryptoService } from '../core/crypto/crypto.service';
import { USER_ROLE } from './roles.constants';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DB_REF_USRE } from '../../constants';

@Injectable()
export class UserService {
  constructor(
    private readonly cryptoService: CryptoService,
    @InjectModel(DB_REF_USRE) private readonly userModel: Model<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async getOneById(id: string): Promise<Optional<User>> {
    return Optional.ofNullable(await this.userModel.findById(id));
  }

  async getOnWithEmail(email: string): Promise<Optional<User>> {
    return Optional.ofNullable(await this.userModel.findOne({ email }).exec());
  }

  async doPasswordMatch(user: User, password: string): Promise<boolean> {
    return this.cryptoService.compare(password, user.password);
  }

  async hasUserWithMatchingEmail(email: string): Promise<boolean> {
    return (await this.userModel.countDocuments({ email }).exec()) === 1;
  }

  async findById(id: string): Promise<Optional<User>> {
    return Optional.ofNullable(await this.userModel.findById(id));
  }

  async saveNew(userRegister: UserDtoRegister): Promise<User> {
    if (await this.hasUserWithMatchingEmail(userRegister.email.toLowerCase())) {
      throw new ConflictException('Email already taken');
    }

    const hashedPwd = await this.cryptoService.hash(userRegister.password);

    const userNew = new this.userModel({
      password: hashedPwd,
      email: userRegister.email,
      lastName: userRegister.lastName,
      firstName: userRegister.firstName,
      roles: [USER_ROLE],
    });

    await userNew.save();
    return userNew;
  }

  async update(id: string, body: UserDtoUpdateInfo): Promise<User> {
    const userFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await userFound
      .update({
        firstName: body.firstName,
        lastName: body.lastName,
      })
      .exec();
    return userFound;
  }

  async updatePassword(id: string, body: UserDtoUpdatePassword): Promise<User> {
    const userFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );

    if (!this.doPasswordMatch(userFound, body.oldPassword)) {
      throw new BadRequestException('Old password do not match');
    }

    if (body.newPassword !== body.newPasswordBis) {
      throw new BadRequestException('New passwords are not the same');
    }

    const newPwd = await this.cryptoService.hash(body.newPassword);

    await userFound
      .update({
        password: newPwd,
      })
      .exec();
    return userFound;
  }

  async deleteById(id: string): Promise<void> {
    const userFound = (await this.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
    await this.userModel.findByIdAndDelete(userFound.id);
  }
}
