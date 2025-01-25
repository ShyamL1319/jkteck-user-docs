import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('ingestion')
export class IngestionController {
  @MessagePattern('document-ingestion')
  handleMessage(@Payload() message: any) {
    console.log('Received message:', message.value);
    // Save the details in the database or perform other actions
  }
}
