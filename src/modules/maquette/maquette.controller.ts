import {
  ApiBearerAuth,
  ApiImplicitBody,
  ApiResponse,
  ApiUseTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Maquette } from './maquette.entity';
import { MaquetteDTO } from './maquette.dto';
import { MaquetteService } from './maquette.service';
import { MasterCreateDto } from '../master/master.dto';
import { Master } from '../master/master.entity';

@ApiUseTags('Maquette')
@Controller()
@ApiBearerAuth()
export class MaquetteController {
  constructor(private readonly maquetteService: MaquetteService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get a list of maquettes',
    isArray: true,
  })
  async getAll(): Promise<Maquette[]> {
    return this.maquetteService.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The maquette created',
  })
  @ApiImplicitBody({
    type: MaquetteDTO,
    name: 'The maquette',
  })
  saveNew(@Body() maquetteDto: MaquetteDTO): Promise<Maquette> {
    return this.maquetteService.saveNew(maquetteDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The maquette with the matching id',
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  async findOne(@Param('id') id: string): Promise<Maquette> {
    return (await this.maquetteService.findById(id)).orElseThrow(
      () => new NotFoundException(),
    );
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The updated master',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async updateOne(
    @Param('id') id: string,
    @Body() maquetteDto: MaquetteDTO,
  ): Promise<Maquette> {
    return this.maquetteService.updateOne(id, maquetteDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The deleted master',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async deleteOne(@Param('id') id: string): Promise<Maquette> {
    return this.maquetteService.deleteOne(id);
  }

  @Post(':id/lock')
  @ApiResponse({
    status: 200,
    description: 'The updated master',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async lockOne(@Param('id') id: string): Promise<Maquette> {
    return this.maquetteService.lockById(id);
  }

  @Post(':id/unlock')
  @ApiResponse({
    status: 200,
    description: 'The updated master',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async unlockOne(@Param('id') id: string): Promise<Maquette> {
    return this.maquetteService.unlockById(id);
  }
}
