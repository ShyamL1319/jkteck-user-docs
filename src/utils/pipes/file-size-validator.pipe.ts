import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
    // "value" is an object containing the file's attributes and metadata
    if (value && value?.size > 1024000) {
      throw new BadRequestException(
        'Please upload file with size less than 1MB!!!',
      );
    }
    return value;
  }
}
