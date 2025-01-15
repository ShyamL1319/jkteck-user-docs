import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configservice: ConfigService,
  ) {}
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async create(userData: Partial<User>): Promise<Partial<User>> {
    const isExistEmail = await this.userRepository.findOne({
      where: { email: userData.email },
    });
    if (isExistEmail) {
      throw new BadRequestException('Email already exists!');
    }
    userData.password = await this.hashPassword(
      userData.password,
      this.configservice.get('PASSWORD_ENCRYTING_SALT'),
    );
    const { password, ...user } = await this.userRepository.save(userData);
    return user;
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  private async hashPassword(
    password: string,
    salt: string = this.configservice.get('PASSWORD_ENCRYTING_SALT'),
  ): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signIn(userData: Partial<User>): Promise<Partial<User>> {
    const { email, password } = userData;
    const user:Partial<User> = await this.userRepository.findOne({ where: { email } });

    if (user && this.validatePassword(password, user.password)) {
      const { password, ...userInfo } = user;
      return userInfo;
    } else {
      return null;
    }
  }

  async validatePassword(password: string, hashPassword:string): Promise<boolean> {
    return await bcrypt.compare(
      password,
      hashPassword,
    );
  }
}
