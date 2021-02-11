import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { RoleRepository } from '../role/role.repository';
import { ReadUserDto, UpdateUserDto } from './dtos';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly roleRepository: RoleRepository,
  ) {}

  async get(userId: number): Promise<ReadUserDto> {
    const user: User = await this.userRepository.findOne(userId, {
      where: { status: 1 },
    });

    if (!user) {
      throw new BadRequestException('Sin resultado para el usuario');
    }
    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this.userRepository.find({
      where: { status: 1 },
    });
    return users.map((user: User) => plainToClass(ReadUserDto, user));
  }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const fountUser = await this.userRepository.findOne(userId, {
      where: { status: 1 },
    });

    if (!fountUser) {
      throw new NotFoundException('User does not exists');
    }

    fountUser.email = user.email;
    fountUser.username = user.username;
    const updatedUser = await this.userRepository.save(fountUser);
    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(userId: number): Promise<void> {
    const userExist = await this.userRepository.findOne(userId, {
      where: { status: 1 },
    });
    if (!userExist) {
      throw new NotFoundException();
    }

    await this.userRepository.update(userId, { status: 0 });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExist = await this.userRepository.findOne(userId, {
      where: { status: 1 },
    });
    if (!userExist) {
      throw new NotFoundException();
    }

    const roleExist = await this.roleRepository.findOne(roleId, {
      where: { status: 1 },
    });

    if (!roleExist) {
      throw new NotFoundException('Role does not exist');
    }

    userExist.roles.push(roleExist);
    await this.userRepository.save(userExist);
    return true;
  }
}
