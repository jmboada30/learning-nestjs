import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto, SignInDto, SignUpDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signup(signUpDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signIn(@Body() signinDto: SignInDto): Promise<LoggedInDto> {
    return this.authService.signin(signinDto);
  }
}
