import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Document Title',
    description: 'The title of the document',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Document Description',
    description: 'The description of the document',
  })
  description: string;
}
