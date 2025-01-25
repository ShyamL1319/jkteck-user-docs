import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('kafka_events')
export class KafkaEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  topic: string;

  @Column()
  partition: number;

  @Column()
  offset: string;

  @Column()
  key: string;

  @Column('text')
  value: string;

  @Column('json', { nullable: true })
  headers: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
