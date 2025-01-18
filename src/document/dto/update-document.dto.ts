import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Updated Document Title',
    description: 'The updated title of the document',
  })
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Updated Document Description',
    description: 'The updated description of the document',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: './uploads/file.pdf',
    description: 'The updated file path of the document',
  })
  filePath?: string;
}
