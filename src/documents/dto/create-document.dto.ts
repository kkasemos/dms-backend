// src/documents/dto/create-document.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;


  @IsNotEmpty()
  @IsNumber()
  ownerID: number;
}
