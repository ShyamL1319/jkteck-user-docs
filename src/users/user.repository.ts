import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email } });
  }

  async findByName(firstName: string, lastName: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.firstName = :firstName', { firstName })
      .andWhere('user.lastName = :lastName', { lastName })
      .getMany();
  }
}
