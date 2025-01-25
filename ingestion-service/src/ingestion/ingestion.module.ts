import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaEventService } from './kafka-event.service';
// import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaEvent } from './kafka-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KafkaEvent]),
    ClientsModule.register([
      {
        name: 'INGESTION_KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId:
              process.env.KAFKA_CLIENT_ID || 'document-consumer-client-id',
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'],
          },
          consumer: {
            groupId: 'document-service-server',
          },
        },
      },
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService, KafkaEventService],
  exports: [IngestionService, KafkaEventService],
})
export class IngestionModule {}
