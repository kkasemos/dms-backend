// src/documents/documents.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    const document = this.documentRepository.create(createDocumentDto);
    return this.documentRepository.save(document);
  }
  async findAll(page: number, limit: number, fileType?: string, title?: string): Promise<Document[]> {
    const skip = (page - 1) * limit;
    const options: any = {
      skip,
      take: limit,
      where: {},
    };

    if (fileType) {
      options.where.fileType = fileType;
    }

    if (title) {
      options.where.title = title;
    }

    return this.documentRepository.find(options);
  }
