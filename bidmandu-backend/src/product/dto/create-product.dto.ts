import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  condition?: string;                     // NEW

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  starting_price: number;
}