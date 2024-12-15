// src/documents/documents.controller.ts
import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { GetDocumentsDto } from './dto/get-documents.dto';
import { Document } from './documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async getDocuments(
    @Query() query: GetDocumentsDto,
  ): Promise<Document[]> {
    const { page, limit, fileType, title } = query;
    return this.documentsService.findAll(page, limit, fileType, title);
  }
  async createDocument(
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Omit<Document, 'content'>> {
    const document = await this.documentsService.create(createDocumentDto);
    return {
      documentID: document.documentID,
      title: document.title,
      fileType: document.fileType,
      ownerID: document.ownerID,
      uploadTimestamp: document.uploadTimestamp,
      currentVersion: document.currentVersion,
    };
  }
}
