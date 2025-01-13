import { UserRole } from '../user-role.enum';

export class UpdateUserDto {
  name?: string;
  email?: number;
  password?: string;
  role?: UserRole;
}
