import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { KafkaEventService } from './kafka-event.service';

@Injectable()
export class IngestionService implements OnModuleInit {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly clientId: string;

  constructor(private readonly kafkaEventService: KafkaEventService) {
    this.clientId =
      process.env.KAFKA_CLIENT_ID || 'document-consumer-client-id';

    this.kafka = new Kafka({
      clientId: this.clientId,
      brokers: [process.env.KAFKA_BROKER_URL || 'localhost:9092'], // Kafka broker URL
    });

    this.consumer = this.kafka.consumer({
      groupId: process.env.KAFKA_CONSUMER_GROUP || 'document-service-server', // Consumer group ID
    });
  }

  async onModuleInit() {
    await this.connect();
    await this.subscribeToTopics();
  }

  private async connect() {
    try {
      await this.consumer.connect();
      console.log(`Kafka Consumer connected with clientId: ${this.clientId}`);
    } catch (error) {
      console.error('Error connecting Kafka Consumer:', error.message);
    }
  }

  private async subscribeToTopics() {
    try {
      await this.consumer.subscribe({
        topic: 'document-ingestion',
        fromBeginning: true,
      });

      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          await this.handleMessage(topic, partition, message);
        },
      });

      console.log(
        `Kafka Consumer subscribed to topics with clientId: ${this.clientId}`,
      );
    } catch (error) {
      console.error('Error subscribing to Kafka topics:', error.message);
    }
  }

  private async handleMessage(topic: string, partition: number, message: any) {
    console.log(
      `Received message from topic ${topic}, partition ${partition}:`,
    );
    console.log(`Key: ${message.key?.toString()}`);
    console.log(`Value: ${message.value?.toString()}`);
    console.log(`Headers: ${JSON.stringify(message.headers)}`);

    try {
      // const parsedValue = JSON.parse(message.value?.toString() || '{}');
      // console.log('Parsed message value:', parsedValue);
      const event = {
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString() || '',
        value: message.value?.toString() || '',
        headers: message.headers || {},
      };
      console.log(`Received event: ${JSON.stringify(event)}`);
      await this.kafkaEventService.saveEvent(event);
    } catch (error) {
      console.error('Error parsing message value:', error.message);
    }
  }
}
