import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/users/user-role.enum';
export const HasRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
