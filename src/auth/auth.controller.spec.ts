import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../users/user.entity';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call AuthService.signUp with correct parameters and return result', async () => {
      const signupDto: Partial<User> = {
        email: 'testuser',
        password: 'password123',
      };
      const expectedResponse: Partial<User> = { id: 1, email: 'testuser' };

      authService.signUp.mockResolvedValue(expectedResponse);

      const result = await authController.signup(signupDto);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('should call AuthService.login with correct parameters and return result', async () => {
      const loginDto: Partial<User> = {
        email: 'testuser',
        password: 'password123',
      };
      const expectedResponse: Partial<User> = {
        id: 1,
        email: 'testuser',
        password: 'abc123',
      };

      authService.login.mockResolvedValue(expectedResponse);

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('logout', () => {
    it('should call req.logout and return undefined', async () => {
      const mockRequest = {
        logout: jest.fn(),
      };

      await authController.logout(mockRequest);

      expect(mockRequest.logout).toHaveBeenCalled();
    });
  });
});
