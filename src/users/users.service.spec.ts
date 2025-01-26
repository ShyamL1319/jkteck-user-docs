import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { UserRole } from './user-role.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUser: Partial<User> = {
    id: 1,
    email: 'test@example.com',
    password: 'hashedPassword123',
    roles: [UserRole.VIEWER],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users with passwords removed', async () => {
      const users = [
        { id: 1, email: 'test1@example.com', password: 'hashedPassword1' },
        { id: 2, email: 'test2@example.com', password: 'hashedPassword2' },
      ];
      userRepository.find.mockResolvedValue(users as User[]);

      const result = await usersService.findAll();

      expect(userRepository.find).toHaveBeenCalled();
      expect(result).toEqual([
        { id: 1, email: 'test1@example.com' },
        { id: 2, email: 'test2@example.com' },
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a user by given criteria', async () => {
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      const result = await usersService.findOne({ id: 1 });

      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(mockUser);
    });
  });

  describe('create', () => {
    it('should create a new user if email does not exist', async () => {
      const userData: Partial<User> = {
        email: 'newuser@example.com',
        password: 'password123',
      };
      const hashedPassword = 'hashedPassword123';
      mockConfigService.get.mockReturnValue(10);
      const mockHashedPassword: string = 'hashedPassword123';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword as never);

      userRepository.findOne.mockResolvedValue(null);
      userRepository.save.mockResolvedValue({
        ...userData,
        password: hashedPassword,
      } as User);

      const result = await usersService.create(userData);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' },
      });
      expect(userRepository.save).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: hashedPassword,
      });
      expect(result).toEqual({ email: 'newuser@example.com' });
    });

    it('should throw BadRequestException if email already exists', async () => {
      userRepository.findOne.mockResolvedValue(mockUser as User);

      await expect(
        usersService.create({ email: 'test@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a user and return the updated data', async () => {
      const userData: Partial<User> = { roles: [UserRole.ADMIN] };
      userRepository.findOneBy.mockResolvedValue(mockUser as User);
      userRepository.update.mockResolvedValue(null);
      userRepository.findOneBy.mockResolvedValue({
        ...mockUser,
        roles: ['viewer'],
      } as User);

      const result = await usersService.update(1, userData);

      expect(userRepository.update).toHaveBeenCalledWith(1, {
        roles: ['admin', 'viewer'],
      });
      expect(result).toBeTruthy();
    });

    it('should throw BadRequestException if roles already exist', async () => {
      const userData: Partial<User> = { roles: [UserRole.VIEWER] };
      userRepository.findOneBy.mockResolvedValue(mockUser as User);

      await expect(usersService.update(1, userData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      userRepository.delete.mockResolvedValue(null);

      await usersService.delete(1);

      expect(userRepository.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('signIn', () => {
    it('should return user data if credentials are valid', async () => {
      const userData: Partial<User> = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(true);
      userRepository.findOne.mockResolvedValue(mockUser as User);

      const result = await usersService.signIn(userData);

      expect(usersService.validatePassword).toHaveBeenCalledWith(
        'password123',
        'hashedPassword123',
      );
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        roles: ['viewer'],
      });
    });

    it('should return null if credentials are invalid', async () => {
      const userData: Partial<User> = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      jest.spyOn(usersService, 'validatePassword').mockResolvedValue(false);
      userRepository.findOne.mockResolvedValue(null);

      const result = await usersService.signIn(userData);

      expect(result).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should return true if passwords match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await usersService.validatePassword(
        'password123',
        'hashedPassword123',
      );

      expect(result).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await usersService.validatePassword(
        'wrongpassword',
        'hashedPassword123',
      );

      expect(result).toBe(false);
    });
  });
});
