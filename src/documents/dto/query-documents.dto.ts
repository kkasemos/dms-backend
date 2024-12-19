// src/documents/dto/query-documents.dto.ts
import { IsOptional, IsString } from 'class-validator';

export class QueryDocumentsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  fileType?: string;
}
