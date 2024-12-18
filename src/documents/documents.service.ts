// src/documents/documents.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';

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

  async findAll(query: QueryDocumentsDto): Promise<Document[]> {
    const { title, fileType } = query;
    const qb = this.documentRepository.createQueryBuilder('document');

    if (title) {
      qb.andWhere('document.title LIKE :title', { title: `%${title}%` });
    }

    if (fileType) {
      qb.andWhere('document.fileType = :fileType', { fileType });
    }

    return qb.getMany();
  }
}