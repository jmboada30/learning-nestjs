import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { CreatedRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { Role } from './role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  async get(roleId: number): Promise<ReadRoleDto> {
    const role: Role = await this.roleRepository.findOne(roleId, {
      where: { status: 1 },
    });

    if (!role) {
      throw new BadRequestException('Sin resultado para el rol');
    }
    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this.roleRepository.find({
      where: { status: 1 },
    });
    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreatedRoleDto>): Promise<ReadRoleDto> {
    const saveRole = await this.roleRepository.save(role);
    return plainToClass(ReadRoleDto, saveRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const fountRole = await this.roleRepository.findOne(roleId, {
      where: { status: 1 },
    });

    if (!fountRole) {
      throw new NotFoundException('Role does not exists');
    }

    fountRole.name = role.name;
    fountRole.description = role.description;
    const updatedRole = await this.roleRepository.save(fountRole);
    return plainToClass(ReadRoleDto, updatedRole);
  }

  async delete(roleId: number): Promise<void> {
    const roleExist = await this.roleRepository.findOne(roleId, {
      where: { status: 1 },
    });
    if (!roleExist) {
      throw new NotFoundException();
    }

    await this.roleRepository.update(roleId, { status: 0 });
  }
}
