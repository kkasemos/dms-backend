// src/documents/documents.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Minio from 'minio';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { QueryDocumentsDto } from './dto/query-documents.dto';

@Injectable()
export class DocumentsService {
  minioClient: Minio.Client;

  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: 'localhost',
      port: 9000,
      useSSL: false, // or true if your MinIO server uses SSL
      accessKey: 'Hch55VUEqJPO1pmB6Udw',
      secretKey: 'emfwh2k4LF9GGS18nyFulKGDTRb9JM2tET5oJwXs',
    });
  }

  async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File): Promise<Document> {
    const fileType = file.mimetype;
    const bucketName = 'dms';
    const objectName = `${Date.now()}-${file.originalname}`;

    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      await this.minioClient.putObject(bucketName, objectName, file.buffer);

      const document = this.documentRepository.create({
        ...createDocumentDto,
        content: objectName,
        fileType
      });
      return this.documentRepository.save(document);
    } catch (error) {
      throw new InternalServerErrorException('Error uploading file to MinIO');
    }
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
