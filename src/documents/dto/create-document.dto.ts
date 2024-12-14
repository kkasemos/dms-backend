// src/documents/dto/create-document.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  fileType: string;

  @IsNotEmpty()
  @IsNumber()
  ownerID: number;
}