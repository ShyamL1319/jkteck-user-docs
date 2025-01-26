import { Test, TestingModule } from '@nestjs/testing';
import { KafkaService } from './kafka.service';
import { ClientKafka } from '@nestjs/microservices';

jest.mock('@nestjs/microservices', () => ({
  ClientKafka: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
    subscribeToResponseOf: jest.fn(),
    on: jest.fn(),
    connect: jest.fn(),
    close: jest.fn(),
  })),
}));

describe('KafkaService', () => {
  let service: KafkaService;
  let kafkaClient: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KafkaService,
        {
          provide: 'KAFKA_SERVICE',
          useClass: ClientKafka,
        },
      ],
    }).compile();

    service = module.get<KafkaService>(KafkaService);
    kafkaClient = module.get<ClientKafka>(
      'KAFKA_SERVICE',
    ) as jest.Mocked<ClientKafka>;
  });

  it('should send a message to a Kafka topic', async () => {
    kafkaClient.emit.mockReturnValue({
      toPromise: jest.fn().mockResolvedValue(undefined),
    });

    await service.sendMessage('test-topic', 'key1', { message: 'hello' });

    expect(kafkaClient.emit).toHaveBeenCalledWith('test-topic', {
      key: 'key1',
      value: { message: 'hello' },
    });
  });

  it('should handle errors when sending a message', async () => {
    kafkaClient.emit.mockReturnValue({
      toPromise: jest.fn().mockRejectedValue(new Error('Kafka error')),
    });

    await expect(
      service.sendMessage('test-topic', 'key1', { message: 'hello' }),
    ).rejects.toThrow('Kafka error');
    expect(kafkaClient.emit).toHaveBeenCalled();
  });

  it('should subscribe to a Kafka topic', () => {
    const handler = jest.fn();
    kafkaClient.subscribeToResponseOf.mockImplementation(() => {});
    kafkaClient.on.mockImplementation((topic, callback: any) => {
      if (topic === 'test-topic') callback({ message: 'hello' });
    });

    service.subscribeToTopic('test-topic', handler);

    expect(kafkaClient.subscribeToResponseOf).toHaveBeenCalledWith(
      'test-topic',
    );
    expect(handler).toHaveBeenCalledWith({ message: 'hello' });
  });

  it('should connect the Kafka client on module init', async () => {
    await service.onModuleInit();
    expect(kafkaClient.subscribeToResponseOf).toHaveBeenCalledWith(
      'document-ingestion',
    );
    expect(kafkaClient.connect).toHaveBeenCalled();
  });

  it('should close the Kafka client on module destroy', async () => {
    await service.onModuleDestroy();
    expect(kafkaClient.close).toHaveBeenCalled();
  });
});
