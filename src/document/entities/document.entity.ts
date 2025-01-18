import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the document',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'Document Title',
    description: 'The title of the document',
  })
  title: string;

  @Column()
  @ApiProperty({
    example: 'Document Description',
    description: 'The description of the document',
  })
  description: string;

  @Column()
  @ApiProperty({
    example: '/path/document.pdf',
    description: 'The file path of the document',
  })
  filePath: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The creation date of the document',
  })
  createdAt: Date;
}
