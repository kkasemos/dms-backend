import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  preferences?: {
    notifications?: boolean;
    theme?: string;
  };
}
