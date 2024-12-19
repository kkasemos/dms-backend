// src/documents/dto/create-document.dto.ts
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  // @IsNumber()
  ownerID: number;
}
