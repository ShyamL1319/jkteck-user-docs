import {
  Injectable,
  NotFoundException,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { createReadStream } from 'fs';
import { basename, extname, join } from 'path';
import { ClientKafka } from '@nestjs/microservices';
import { KafkaService } from 'src/kafka/kafka.service';
@Injectable()
export class DocumentService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private readonly kafkaService: KafkaService,
  ) {}
  /**
   * Create a new document
   * @param createDocumentDto CreateDocumentDto
   * @param file Express.Multer.File
   * @returns Promise<Document>
   */
  async upload(
    createDocumentDto: CreateDocumentDto,
    filePath: string,
  ): Promise<Document> {
    const document = this.documentRepository.create({
      ...createDocumentDto,
      filePath,
    });
    this.kafkaService.sendMessage(
      'document-ingestion',
      'document-added',
      document,
    );
    return this.documentRepository.save(document);
  }

  /**
   * Download a file by document ID
   * @param id number
   * @returns Promise<{ file: ReadStream, fileName: string, filepath: string, ext: string }>
   * @throws NotFoundException if document is not found
   */
  async downloadFile({ id }) {
    const fileFound: Document = await this.findOne(id);
    if (!fileFound) {
      throw new NotFoundException(`document with ${id} not found`);
    }
    const filepath = join(process.cwd(), fileFound.filePath);
    const file = await createReadStream(filepath);
    this.kafkaService.sendMessage(
      'document-ingestion',
      'document-downloaded',
      fileFound,
    );
    return {
      file,
      fileName: fileFound.title + '_' + basename(filepath),
      filepath: fileFound.filePath,
      ext: extname(filepath),
    };
  }

  /**
   * Get all documents
   * @returns Promise<Document[]>
   */
  async findAll(): Promise<Document[]> {
    return this.documentRepository.find();
  }

  /**
   * Get a document by ID
   * @param id number
   * @returns Promise<Document>
   * @throws NotFoundException if document is not found
   */
  async findOne(id: number): Promise<Document> {
    const document = await this.documentRepository.findOne({ where: { id } });
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return document;
  }

  /**
   * Update a document by ID
   * @param id number
   * @param updateDocumentDto UpdateDocumentDto
   * @returns Promise<Document>
   * @throws NotFoundException if document is not found
   */
  async update(
    id: number,
    updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    const document = await this.findOne(id);
    Object.assign(document, updateDocumentDto);
    this.kafkaService.sendMessage(
      'document-ingestion',
      'document-updated',
      document,
    );
    return this.documentRepository.save(document);
  }

  /**
   * Delete a document by ID
   * @param id number
   * @returns Promise<void>
   * @throws NotFoundException if document is not found
   */
  async remove(id: number): Promise<void> {
    const document = await this.findOne(id);
    this.kafkaService.sendMessage(
      'document-ingestion',
      'document-deleted',
      document,
    );
    await this.documentRepository.remove(document);
  }
}
