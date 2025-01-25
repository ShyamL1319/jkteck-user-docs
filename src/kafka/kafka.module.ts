import { Module } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId:
              process.env.KAFKA_CLIENT_ID || 'document-producer-client-id',
            brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'], // Default to 'kafka:9092'
          },
          consumer: {
            groupId: 'document-service-server', // Unique consumer group ID
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
