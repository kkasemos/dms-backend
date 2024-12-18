// src/documents/documents.controller.ts
import { Controller, Post, Get, Body, Query, UploadedFile, UseInterceptors } from
'@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { Document } from './documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Omit<Document, 'content'>> {
    const document = await this.documentsService.create(createDocumentDto, file);
    return {
      documentID: document.documentID,
      title: document.title,
      fileType: document.fileType,
      ownerID: document.ownerID,
      uploadTimestamp: document.uploadTimestamp,
      currentVersion: document.currentVersion,
    };
  }

  @Get()
  async getDocuments(
    @Query() query: QueryDocumentsDto,
  ): Promise<Omit<Document, 'content'>[]> {
    const documents = await this.documentsService.findAll(query);
    return documents.map(({ content, ...doc }) => doc);
  }
}