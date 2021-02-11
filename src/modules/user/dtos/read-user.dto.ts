import { Exclude, Expose, Type } from 'class-transformer';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ReadRoleDto } from '../../role/dtos/read-role.dto';
import { ReadUserDetailDto } from './read-user-details.dto';

@Exclude()
export class ReadUserDto {
  @Expose()
  @IsNumber()
  readonly id: string;

  @Expose()
  @IsEmail()
  readonly email: string;

  @Expose()
  @IsString()
  readonly username: string;

  // @Expose()
  // @IsEmail()
  // readonly password: string;

  @Expose()
  @Type(() => ReadUserDetailDto)
  readonly details: ReadUserDetailDto;

  @Expose()
  @Type(() => ReadRoleDto)
  readonly roles: ReadRoleDto[];
}
