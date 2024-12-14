import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8) // Ensure passwords are at least 8 characters long
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  preferences?: {
    notifications?: boolean;
    theme?: string;
  };
}
