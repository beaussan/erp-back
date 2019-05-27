import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

class CourseDTO {
  @ApiModelProperty({ example: 'Projet de groupe' })
  @IsString()
  name: string;

  @ApiModelProperty({ example: 20 })
  @IsNumber()
  nmbGroupTd: number;

  @ApiModelProperty({ example: 20 })
  @IsNumber()
  nmbAmphiHour: number;

  @ApiModelProperty({ example: 10 })
  @IsNumber()
  nmbTdHour: number;

  @ApiModelProperty({ example: 30 })
  @IsNumber()
  coefCC: number;

  @ApiModelProperty({ example: 70 })
  @IsNumber()
  coefExam: number;

  @ApiModelProperty({ example: 2 })
  @IsNumber()
  lengthExam: number;

  @ApiModelProperty({ example: 2 })
  @IsNumber()
  nmbEcts: number;

  @ApiModelProperty({ example: '' })
  @IsOptional()
  @IsString()
  commun: string;

  @ApiModelProperty({ example: 'Soutenance + dossier' })
  @IsString()
  examType: string;

  @ApiModelProperty({ example: false })
  @IsBoolean()
  courseEnglish: boolean;

  @ApiModelProperty({ example: 'Group project' })
  @IsString()
  englishTranslation: string;

  @ApiModelProperty({ example: false })
  @IsBoolean()
  ratrappage: boolean;
}

class ModuleDTO {
  @ApiModelProperty({ example: 'UE : M801' })
  @IsString()
  name: string;

  @ApiModelProperty({ isArray: true, type: CourseDTO })
  @ValidateNested()
  @IsArray()
  courses: CourseDTO[];
}

class SemesterDTO {
  @ApiModelProperty({ example: 2 })
  @IsNumber()
  number: number;

  @ApiModelProperty({ isArray: true, type: ModuleDTO })
  @ValidateNested()
  @IsArray()
  modules: ModuleDTO[];
}

class ExtraGroupItemDTO {
  @ApiModelProperty({ example: 'Rentrée' })
  @IsString()
  name: string;

  @ApiModelProperty({ example: 2 })
  @IsNumber()
  hour: number;

  @ApiModelProperty({ example: '17/09 Matin' })
  @IsString()
  date: string;
}

class ExtraGroupDTO {
  @ApiModelProperty({ example: 'Integration' })
  @IsString()
  name: string;

  @ApiModelProperty({ isArray: true, type: ExtraGroupItemDTO })
  @ValidateNested()
  @IsArray()
  items: ExtraGroupItemDTO[];
}

class YearDTO {
  @ApiModelProperty({ example: 'Master 1 ' })
  @IsString()
  level: string;

  @ApiModelProperty({ isArray: true, type: SemesterDTO })
  @ValidateNested()
  @IsArray()
  semesters: SemesterDTO[];

  @ApiModelProperty({ isArray: true, type: ExtraGroupDTO })
  @ValidateNested()
  @IsArray()
  extras: ExtraGroupDTO[];
}

export class MaquetteDTO {
  @ApiModelProperty({ example: '2018/2019' })
  @IsString()
  schoolYear: string;

  @IsString() masterId: string;

  @ApiModelProperty({ isArray: true, type: YearDTO })
  @IsArray()
  years: YearDTO[];
}
