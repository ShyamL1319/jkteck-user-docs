import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user-role.enum';
import { BadRequestException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, username: 'test' }];
      mockUsersService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = { id: 1, username: 'test' };
      mockUsersService.findOne.mockResolvedValue(result);

      expect(await controller.findOne(1)).toBe(result);
      expect(mockUsersService.findOne).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('create', () => {
    it('should create and return the created user', async () => {
      const userData = { email: 'test' };
      const result = { id: 1, ...userData };
      mockUsersService.create.mockResolvedValue(result);

      expect(await controller.create(userData)).toBe(result);
      expect(mockUsersService.create).toHaveBeenCalledWith(userData);
    });
  });

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const userData = { email: 'updatedTest' };
      const result = { id: 1, ...userData };
      mockUsersService.update.mockResolvedValue(result);

      expect(await controller.update(1, userData)).toBe(result);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, userData);
    });

    it('should throw BadRequestException when roles already exist', async () => {
      const userData = { roles: [UserRole.ADMIN] };
      mockUsersService.update.mockRejectedValue(
        new BadRequestException('Roles Already Exists'),
      );

      try {
        await controller.update(1, userData);
      } catch (e) {
        expect(e.response.message).toBe('Roles Already Exists');
      }
    });
  });

  describe('delete', () => {
    it('should delete the user', async () => {
      mockUsersService.delete.mockResolvedValue(undefined);

      await controller.delete(1);
      expect(mockUsersService.delete).toHaveBeenCalledWith(1);
    });
  });
});
