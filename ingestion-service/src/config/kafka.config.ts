import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const kafkaClientOptions: ClientProviderOptions = {
  name: 'INGESTION_KAFKA_SERVICE',
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: process.env.KAFKA_CLIENT_ID || 'document-consumer-client-id',
      brokers: [process.env.KAFKA_BROKER_URL || 'kafka:19092'],
    },
    consumer: {
      groupId: 'document-service-server',
    },
  },
};
