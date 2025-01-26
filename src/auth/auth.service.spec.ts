import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn(),
    signIn: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUserById', () => {
    it('should call UsersService.findOne with correct parameters and return the result', async () => {
      const userData = { id: 1 };
      const user: Partial<User> = { id: 1, email: 'testuser@gmail.com' };

      userService.findOne.mockResolvedValue(user as User);

      const result = await authService.validateUserById(userData);

      expect(userService.findOne).toHaveBeenCalledWith(userData);
      expect(result).toEqual(user);
    });
  });

  describe('signUp', () => {
    it('should call UsersService.create with correct parameters and return the result', async () => {
      const signupDto: Partial<User> = {
        email: 'testuser@gmail.com',
        password: 'password123',
      };
      const createdUser: Partial<User> = { id: 1, email: 'testuser@gmail.com' };

      userService.create.mockResolvedValue(createdUser as User);

      const result = await authService.signUp(signupDto);

      expect(userService.create).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(createdUser);
    });

    it('should remove roles from signupDto before calling UsersService.create', async () => {
      const signupDto: Partial<User> = {
        email: 'testuser@gmail.com',
        password: 'password123',
        roles: [UserRole.ADMIN],
      };
      const createdUser: Partial<User> = { id: 1, email: 'testuser@gmail.com' };

      userService.create.mockResolvedValue(createdUser as User);

      const result = await authService.signUp(signupDto);

      expect(userService.create).toHaveBeenCalledWith({
        email: 'testuser@gmail.com',
        password: 'password123',
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('login', () => {
    it('should call UsersService.signIn and JwtService.sign with correct parameters and return the result', async () => {
      const loginDto: Partial<User> = {
        email: 'testuser@gmail.com',
        password: 'password123',
      };
      const userResult: Partial<User> = { id: 1, email: 'testuser@gmail.com' };
      const accessToken = 'mockedAccessToken';

      userService.signIn.mockResolvedValue(userResult as User);
      jwtService.sign.mockReturnValue(accessToken);

      const result = await authService.login(loginDto);

      expect(userService.signIn).toHaveBeenCalledWith(loginDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ userResult });
      expect(result).toEqual({
        user: userResult,
        accessToken,
      });
    });

    it('should throw UnauthorizedException if signIn returns null', async () => {
      const loginDto: Partial<User> = {
        email: 'invaliduser@email.com',
        password: 'wrongpassword',
      };

      userService.signIn.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials!'),
      );
    });
  });
});
