import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(/^[0-9]{10}$/, { message: 'Phone must be 10 digits' })
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;
}