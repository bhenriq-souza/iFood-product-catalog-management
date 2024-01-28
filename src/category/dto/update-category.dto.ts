import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsOptional()
  readonly title?: string;

  @IsOptional()
  readonly owner?: string;

  @IsOptional()
  readonly description?: string;
}
