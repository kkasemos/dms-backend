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
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {
    this.minioClient = new Minio.Client({
      endPoint: 'YOUR_MINIO_ENDPOINT',
      port: YOUR_MINIO_PORT,
      useSSL: false, // or true if your MinIO server uses SSL
      accessKey: 'YOUR_MINIO_ACCESS_KEY',
      secretKey: 'YOUR_MINIO_SECRET_KEY',
    });
  }

  async create(createDocumentDto: CreateDocumentDto, file: Express.Multer.File): Promise<Document> {
    const bucketName = 'your-bucket-name';
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
