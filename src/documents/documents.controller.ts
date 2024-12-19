// src/documents/documents.controller.ts
import { Controller, Post, Get, Body, Query, UploadedFile, UseInterceptors } from
'@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';
import { Document } from './documents.entity';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
        'image/jpeg',
        'image/png'
      ];
      if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(new Error('Invalid file type'), false);
      }
    },
    storage: diskStorage({
      destination: './uploads', // Ensure this directory exists
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  async createDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDocumentDto: CreateDocumentDto,
  ): Promise<Omit<Document, 'content'>> {
    const document = await this.documentsService.create({ ...createDocumentDto }, file);
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
