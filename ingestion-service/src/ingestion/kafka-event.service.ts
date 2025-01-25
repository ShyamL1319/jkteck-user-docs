import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaEvent } from './kafka-event.entity';

@Injectable()
export class KafkaEventService {
  constructor(
    @InjectRepository(KafkaEvent)
    private readonly kafkaEventRepository: Repository<KafkaEvent>,
  ) {}

  async saveEvent(event: Partial<KafkaEvent>) {
    return this.kafkaEventRepository.save(event);
  }
}
