import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreatedRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get(':roleId')
  getRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
    return this.roleService.get(roleId);
  }

  @Get()
  getRoles(): Promise<ReadRoleDto[]> {
    return this.roleService.getAll();
  }

  @Post()
  createRole(@Body() role: Partial<CreatedRoleDto>): Promise<ReadRoleDto> {
    return this.roleService.create(role);
  }

  @Put(':roleId')
  updateRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() role: Partial<UpdateRoleDto>,
  ) {
    return this.roleService.update(roleId, role);
  }

  @Delete(':roleId')
  deleteRole(@Param('roleId', ParseIntPipe) roleId): Promise<void> {
    return this.roleService.delete(roleId);
  }
}
