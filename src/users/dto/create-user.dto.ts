import { UserRole } from '../user-role.enum';

export class CreateUserDto {
  name: string;
  email: number;
  password: string;
  role: UserRole;
}
