import { IsString, MaxLength } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MaxLength(100, { message: 'This name is not valid' })
  readonly name;

  @IsString()
  @MaxLength(100, { message: 'This description is not valid' })
  readonly description;
}
