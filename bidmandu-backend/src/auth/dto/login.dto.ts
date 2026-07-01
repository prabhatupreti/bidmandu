import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email or phone number' })
  @IsNotEmpty()
  identifier: string; // can be email or phone

  @ApiProperty()
  @IsString()
  password: string;
}