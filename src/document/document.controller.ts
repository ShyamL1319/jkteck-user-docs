import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Res,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentService } from './document.service';
import { Document } from './entities/document.entity';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileSizeValidationPipe } from 'src/utils/pipes/file-size-validator.pipe';
import type { Response } from 'express';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiConsumes,
  ApiParam,
} from '@nestjs/swagger';
import { ClientKafka } from '@nestjs/microservices';

@Controller('documents')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  /**
   * Create a new document
   * @param createDocumentDto CreateDocumentDto
   * @param file Express.Multer.File
   * @returns Promise<any>
   */
  @Post('upload')
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({
    status: 201,
    description: 'The document has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateDocumentDto, description: 'Document creation data' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now().toString();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async upload(
    @Body() createDocumentDto: CreateDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Document> {
    const document = this.documentService.upload(createDocumentDto, file.path);
    return document;
  }

  @Get('download/:id')
  async downloadFile(
    @Param('id') id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { file, fileName, filepath } =
      await this.documentService.downloadFile({
        id: +id,
      });
    file.pipe(response);
    // response.set({
    //   'Content-Type': 'application/json',
    //   'Content-Disposition': `attachment;filename=${fileName}`,
    // });
    // return new StreamableFile(file);
    // return response.sendFile(filepath, { root: './../../' });
  }

  /**
   * Get all documents
   * @returns Promise<any[]>
   */
  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'List of documents.' })
  async findAll(): Promise<Document[]> {
    return this.documentService.findAll();
  }

  /**
   * Get a document by ID
   * @param id number
   * @returns Promise<any>
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the document to retrieve',
  })
  async findOne(@Param('id') id: number): Promise<Document> {
    return this.documentService.findOne(+id);
  }

  /**
   * Update a document by ID
   * @param id number
   * @param updateDocumentDto UpdateDocumentDto
   * @returns Promise<any>
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a document by ID' })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the document to update',
  })
  @ApiBody({ type: UpdateDocumentDto, description: 'Document update data' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix = Date.now();
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  @UsePipes(
    new ValidationPipe({ transform: true }),
    new FileSizeValidationPipe(),
  )
  async update(
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Document> {
    if (file?.path) {
      updateDocumentDto.filePath = file?.path;
    }
    return this.documentService.update(id, updateDocumentDto);
  }

  /**
   * Delete a document by ID
   * @param id number
   * @returns void
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document by ID' })
  @ApiResponse({
    status: 200,
    description: 'The document has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Document not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the document to delete',
  })
  async remove(@Param('id') id: number): Promise<void> {
    return this.documentService.remove(+id);
  }
}
