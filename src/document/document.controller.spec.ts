// import { Test, TestingModule } from '@nestjs/testing';
// import { DocumentController } from './document.controller';
// import { DocumentService } from './document.service';
// import { CreateDocumentDto } from './dto/create-document.dto';
// import { UpdateDocumentDto } from './dto/update-document.dto';
// import { Document } from './entities/document.entity';
// import { NotFoundException } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { FileSizeValidationPipe } from '../utils/pipes/file-size-validator.pipe';
// import { Response } from 'express';

// describe('DocumentController', () => {
//   let controller: DocumentController;
//   let service: jest.Mocked<DocumentService>;

//   beforeEach(async () => {
//     const mockDocumentService = {
//       upload: jest.fn(),
//       downloadFile: jest.fn(),
//       findAll: jest.fn(),
//       findOne: jest.fn(),
//       update: jest.fn(),
//       remove: jest.fn(),
//     };

//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [DocumentController],
//       providers: [
//         {
//           provide: DocumentService,
//           useValue: mockDocumentService,
//         },
//       ],
//     }).compile();

//     controller = module.get<DocumentController>(DocumentController);
//     service = module.get<DocumentService>(DocumentService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('upload', () => {
//     it('should create a document and return it', async () => {
//       const createDocumentDto: CreateDocumentDto = {
//         title: 'Test Title',
//         description: 'Test Description',
//       };
//       const file = { path: 'uploads/test.pdf' } as Express.Multer.File;
//       const mockDocument = {
//         id: 1,
//         ...createDocumentDto,
//         filePath: file.path,
//       } as Document;

//       service.upload.mockResolvedValue(mockDocument);

//       const result = await controller.upload(createDocumentDto, file);

//       expect(service.upload).toHaveBeenCalledWith(createDocumentDto, file.path);
//       expect(result).toEqual(mockDocument);
//     });
//   });

//   describe('downloadFile', () => {
//     it('should download a file by ID', async () => {
//       const id = 1;
//       const mockDocument = {
//         file: { pipe: jest.fn() },
//         fileName: 'test.pdf',
//         filepath: 'uploads/test.pdf',
//       };
//       const mockResponse = { sendFile: jest.fn() } as unknown as Response;

//       service.downloadFile.mockResolvedValue(mockDocument);

//       await controller.downloadFile(id, mockResponse);

//       expect(service.downloadFile).toHaveBeenCalledWith({ id });
//       expect(mockDocument.file.pipe).toHaveBeenCalledWith(mockResponse);
//     });

//     it('should throw NotFoundException if document is not found', async () => {
//       service.downloadFile.mockRejectedValue(new NotFoundException());

//       await expect(controller.downloadFile(1, {} as Response)).rejects.toThrow(
//         NotFoundException,
//       );
//     });
//   });

//   describe('findAll', () => {
//     it('should return all documents', async () => {
//       const mockDocuments = [{ id: 1 }, { id: 2 }] as Document[];
//       service.findAll.mockResolvedValue(mockDocuments);

//       const result = await controller.findAll();

//       expect(service.findAll).toHaveBeenCalled();
//       expect(result).toEqual(mockDocuments);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a document by ID', async () => {
//       const id = 1;
//       const mockDocument = { id, title: 'Test Document' } as Document;

//       service.findOne.mockResolvedValue(mockDocument);

//       const result = await controller.findOne(id);

//       expect(service.findOne).toHaveBeenCalledWith(id);
//       expect(result).toEqual(mockDocument);
//     });

//     it('should throw NotFoundException if document is not found', async () => {
//       service.findOne.mockRejectedValue(new NotFoundException());

//       await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('update', () => {
//     it('should update a document and return it', async () => {
//       const id = 1;
//       const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Title' };
//       const file = { path: 'uploads/updated.pdf' } as Express.Multer.File;
//       const mockDocument = {
//         id,
//         ...updateDocumentDto,
//         filePath: file.path,
//       } as Document;

//       service.update.mockResolvedValue(mockDocument);

//       const result = await controller.update(id, updateDocumentDto, file);

//       expect(service.update).toHaveBeenCalledWith(id, {
//         ...updateDocumentDto,
//         filePath: file.path,
//       });
//       expect(result).toEqual(mockDocument);
//     });

//     it('should update a document without a file', async () => {
//       const id = 1;
//       const updateDocumentDto: UpdateDocumentDto = { title: 'Updated Title' };
//       const mockDocument = { id, ...updateDocumentDto } as Document;

//       service.update.mockResolvedValue(mockDocument);

//       const result = await controller.update(id, updateDocumentDto);

//       expect(service.update).toHaveBeenCalledWith(id, updateDocumentDto);
//       expect(result).toEqual(mockDocument);
//     });
//   });

//   describe('remove', () => {
//     it('should delete a document by ID', async () => {
//       const id = 1;

//       service.remove.mockResolvedValue();

//       await controller.remove(id);

//       expect(service.remove).toHaveBeenCalledWith(id);
//     });

//     it('should throw NotFoundException if document is not found', async () => {
//       service.remove.mockRejectedValue(new NotFoundException());

//       await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Document } from './entities/document.entity';
import { NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { ReadStream } from 'fs';
// import { mocked } from 'ts-jest/utils'; // For strongly typed mocks

jest.mock('./document.service'); // Automatically mocks DocumentService

describe('DocumentController', () => {
  let controller: DocumentController;
  let service: jest.Mocked<DocumentService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [DocumentService],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
    service = module.get<DocumentService>(
      DocumentService,
    ) as jest.Mocked<DocumentService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    it('should create a document and return it', async () => {
      const createDocumentDto: CreateDocumentDto = {
        title: 'Test Title',
        description: 'Test Description',
      };
      const file = { path: 'uploads/test.pdf' } as Express.Multer.File;
      const mockDocument = {
        id: 1,
        ...createDocumentDto,
        filePath: file.path,
      } as Document;

      service.upload.mockResolvedValue(mockDocument);

      const result = await controller.upload(createDocumentDto, file);

      expect(service.upload).toHaveBeenCalledWith(createDocumentDto, file.path);
      expect(result).toEqual(mockDocument);
    });
  });

  describe('downloadFile', () => {
    it('should download a file by ID', async () => {
      const id = 1;
      const mockDocument = {
        file: { pipe: jest.fn() } as unknown as ReadStream,
        fileName: 'test.pdf',
        filepath: 'uploads/test.pdf',
        ext: '.pdf',
      };
      const mockResponse = { sendFile: jest.fn() } as unknown as Response;

      service.downloadFile.mockResolvedValue(mockDocument);

      await controller.downloadFile(id, mockResponse);

      expect(service.downloadFile).toHaveBeenCalledWith({ id });
      expect(mockDocument.file.pipe).toHaveBeenCalledWith(mockResponse);
    });
  });

});
