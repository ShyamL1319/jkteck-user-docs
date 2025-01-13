import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    return this.usersService.create(userData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(id, userData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.usersService.delete(id);
  }
}
