import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const kafkaClientOptions: ClientProviderOptions = {
  name: 'KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: [process.env.KAFKA_BROKER_URL || 'kafka:9092'], // Default to 'kafka:9092'
    },
    consumer: {
      groupId: 'document-service-server', // Unique consumer group ID
    },
  },
};
