import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  newpassword: string;
}
