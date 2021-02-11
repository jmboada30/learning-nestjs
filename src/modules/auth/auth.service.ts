import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/roltype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { LoggedInDto, SignInDto, SignUpDto } from './dtos';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignUpDto): Promise<void> {
    const { email, username } = signupDto;
    const userExists = await this.authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('username or email already exists');
    }

    return this.authRepository.signup(signupDto);
  }

  async signin(signinDto: SignInDto): Promise<LoggedInDto> {
    const { username, password } = signinDto;
    const user: User = await this.authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('user does not exists');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = this.jwtService.sign(payload);
    return plainToClass(LoggedInDto, { token, user });
  }
}
