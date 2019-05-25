import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class MasterCreateDto {
  @IsString()
  @ApiModelProperty({ example: 'Master III' })
  name: string;

  @IsString()
  @ApiModelProperty({ example: 'Un master en alternance informatique' })
  description: string;
}
