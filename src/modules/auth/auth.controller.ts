import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() signUpDto: SignUpDto): Promise<void> {
    return this.authService.signup(signUpDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(@Body() signinDto: SignInDto) {
    return this.authService.signin(signinDto);
  }
}
