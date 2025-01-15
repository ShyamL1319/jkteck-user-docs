import { IsEmail, IsString } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: number;

  @IsString()
  password: string;

  @IsString()
  roles: UserRole[];
}
