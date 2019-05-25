import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isAdmin, User, UserSchema } from './user.entity';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiImplicitParam,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import {
  UserDtoRegister,
  UserDtoUpdateInfo,
  UserDtoUpdatePassword,
} from './user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../decorators/roles.decorator';
import { CurrentUser } from '../../decorators/currentUser.decorator';
import { ADMIN_ROLE } from './roles.constants';

@ApiUseTags('User')
@Controller()
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get a list of all User.',
    type: UserSchema,
    isArray: true,
  })
  @Roles(ADMIN_ROLE)
  async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The User has been created.',
  })
  @Roles(ADMIN_ROLE)
  saveNew(@Body() userDto: UserDtoRegister): Promise<User> {
    return this.userService.saveNew(userDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The User with the matching id',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException();
    }
    return (await this.userService.getOneById(id)).orElseThrow(
      () => new NotFoundException(),
    );
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated User with the matching id',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async updateOne(
    @Param('id') id: string,
    @Body() userDto: UserDtoUpdateInfo,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException();
    }
    return await this.userService.update(id, userDto);
  }

  @Put(':id/password')
  @ApiResponse({
    status: 200,
    description: 'The updated User with the matching id',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async updateOnePassword(
    @Param('id') id: string,
    @Body() userDto: UserDtoUpdatePassword,
    @CurrentUser() user: User,
  ): Promise<User> {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException();
    }
    return await this.userService.updatePassword(id, userDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The User with the matching id was deleted',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async deleteOne(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<void> {
    if (!isAdmin(user) && user.id !== id) {
      throw new ForbiddenException();
    }
    await this.userService.deleteById(id);
  }
}
