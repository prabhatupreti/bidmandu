import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;
}