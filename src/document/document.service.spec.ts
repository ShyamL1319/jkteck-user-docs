import { Test, TestingModule } from '@nestjs/testing';
import { DocumentService } from './document.service';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { NotFoundException } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

const mockDocumentRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

const mockKafkaService = {
  sendMessage: jest.fn(),
};

describe('DocumentService', () => {
  let service: DocumentService;
  let repository: jest.Mocked<Repository<Document>>;
  let kafkaService: jest.Mocked<KafkaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockDocumentRepository,
        },
        {
          provide: KafkaService,
          useValue: mockKafkaService,
        },
      ],
    }).compile();

    service = module.get<DocumentService>(DocumentService);
    repository = module.get(getRepositoryToken(Document));
    kafkaService = module.get(KafkaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    it('should create and save a new document', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Document',
        description: 'Test Description',
      };
      const filePath = 'uploads/test.pdf';
      const mockDocument = {
        id: 1,
        ...createDocumentDto,
        filePath,
      } as Document;

      repository.create.mockReturnValue(mockDocument);
      repository.save.mockResolvedValue(mockDocument);

      const result = await service.upload(createDocumentDto, filePath);

      expect(repository.create).toHaveBeenCalledWith({
        ...createDocumentDto,
        filePath,
      });
      expect(repository.save).toHaveBeenCalledWith(mockDocument);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'document-ingestion',
        'document-added',
        mockDocument,
      );
      expect(result).toEqual(mockDocument);
    });
  });

  describe('findAll', () => {
    it('should return all documents', async () => {
      const mockDocuments = [
        { id: 1, title: 'Doc 1', description: 'Desc 1' },
        { id: 2, title: 'Doc 2', description: 'Desc 2' },
      ] as Document[];

      repository.find.mockResolvedValue(mockDocuments);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual(mockDocuments);
    });
  });

  describe('findOne', () => {
    it('should return a document by ID', async () => {
      const id = 1;
      const mockDocument = {
        id,
        title: 'Test Doc',
        description: 'Test Desc',
      } as Document;

      repository.findOne.mockResolvedValue(mockDocument);

      const result = await service.findOne(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(mockDocument);
    });

    it('should throw NotFoundException if document is not found', async () => {
      const id = 999;
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(
        new NotFoundException(`Document with ID ${id} not found`),
      );
    });
  });

  describe('update', () => {
    it('should update and save a document', async () => {
      const id = 1;
      const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Title' };
      const mockDocument = {
        id,
        title: 'Old Title',
        description: 'Desc',
      } as Document;

      repository.findOne.mockResolvedValue(mockDocument);
      repository.save.mockResolvedValue({
        ...mockDocument,
        ...updateDocumentDto,
      });

      const result = await service.update(id, updateDocumentDto);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockDocument,
        ...updateDocumentDto,
      });
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'document-ingestion',
        'document-updated',
        { ...mockDocument, ...updateDocumentDto },
      );
      expect(result).toEqual({ ...mockDocument, ...updateDocumentDto });
    });

    it('should throw NotFoundException if document is not found', async () => {
      const id = 999;
      const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Title' };

      repository.findOne.mockResolvedValue(null);

      await expect(service.update(id, updateDocumentDto)).rejects.toThrow(
        new NotFoundException(`Document with ID ${id} not found`),
      );
    });
  });

  describe('remove', () => {
    it('should remove a document by ID', async () => {
      const id = 1;
      const mockDocument = {
        id,
        title: 'Test Doc',
        description: 'Test Desc',
      } as Document;

      repository.findOne.mockResolvedValue(mockDocument);
      repository.remove.mockResolvedValue(mockDocument);

      await service.remove(id);

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(repository.remove).toHaveBeenCalledWith(mockDocument);
      expect(kafkaService.sendMessage).toHaveBeenCalledWith(
        'document-ingestion',
        'document-deleted',
        mockDocument,
      );
    });

    it('should throw NotFoundException if document is not found', async () => {
      const id = 999;

      repository.findOne.mockResolvedValue(null);

      await expect(service.remove(id)).rejects.toThrow(
        new NotFoundException(`Document with ID ${id} not found`),
      );
    });
  });
});
