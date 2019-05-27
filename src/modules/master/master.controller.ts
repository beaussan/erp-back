import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
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
import { MasterService } from './master.service';
import { Master, MasterSchema } from './master.entity';
import { MasterCreateDto } from './master.dto';

@ApiUseTags('Master')
@Controller()
@ApiBearerAuth()
export class MasterController {
  constructor(private readonly masterService: MasterService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get a list of all masters.',
    isArray: true,
  })
  async getAll(): Promise<Master[]> {
    return this.masterService.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The master has been created.',
  })
  saveNew(@Body() masterDto: MasterCreateDto): Promise<Master> {
    return this.masterService.saveNew(masterDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The master with the matching id',
  })
  @ApiResponse({ status: 404, description: 'Not found.' })
  async findOne(@Param('id') id: string): Promise<Master> {
    return (await this.masterService.getOneById(id)).orElseThrow(
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
    @Body() masterDto: MasterCreateDto,
  ): Promise<Master> {
    return this.masterService.updateOne(id, masterDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'The master with the matching id was deleted',
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  async deleteOne(@Param('id') id: string): Promise<void> {
    await this.masterService.deleteById(id);
  }
}
