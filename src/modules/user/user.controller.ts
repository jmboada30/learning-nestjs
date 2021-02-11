import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { ReadUserDto, UpdateUserDto } from './dtos';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':userId')
  @Roles('ADMIN', 'AUTHOR')
  @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
    return this.userService.get(userId);
  }

  @Get()
  @UseGuards(AuthGuard())
  getUsers(): Promise<ReadUserDto[]> {
    return this.userService.getAll();
  }

  @Put(':userId')
  updateUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDto,
  ) {
    return this.userService.update(userId, user);
  }

  @Delete(':userId')
  deleteUser(@Param('userId', ParseIntPipe) userId): Promise<void> {
    return this.userService.delete(userId);
  }

  @Post('setRole/:userId/:roleId')
  setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this.userService.setRoleToUser(userId, roleId);
  }
}
