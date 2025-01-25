import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // Inject Kafka client
  ) {}

  /**
   * Send a message to a Kafka topic.
   * @param topic - Kafka topic name
   * @param key - Optional key for the message
   * @param value - The message payload
   */
  async sendMessage(topic: string, key: string | null, value: any) {
    const payload = typeof value === 'string' ? value : JSON.stringify(value);
    try {
      await this.kafkaClient
        .emit(topic, { key, value: JSON.parse(payload) })
        .toPromise();
      console.log(`Message sent to topic "${topic}"`, { key, payload });
    } catch (error) {
      console.error(`Failed to send message to topic "${topic}"`, error);
      throw error;
    }
  }

  /**
   * Listen to messages from Kafka.
   * @param topic - Kafka topic name
   * @param handler - Callback to handle the received message
   */
  subscribeToTopic(topic: string, handler: (message: any) => void) {
    this.kafkaClient.subscribeToResponseOf(topic);
    this.kafkaClient.on<any>(topic, (payload) => {
      console.log(`Message received from topic "${topic}":`, payload);
      handler(payload);
    });
  }

  /**
   * Kafka client is connected.
   */
  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf('document-ingestion'); // Example topic (can be omitted)
    await this.kafkaClient.connect();
    console.log('Kafka client connected');
  }

  /**
   * disconnect the Kafka client.
   */
  async onModuleDestroy() {
    await this.kafkaClient.close();
    console.log('Kafka client disconnected');
  }
}
