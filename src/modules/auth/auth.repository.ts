import { genSalt, hash } from 'bcryptjs';
import { EntityRepository, getConnection, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { RoleType } from '../role/roltype.enum';
import { UserDetails } from '../user/user.details.entity';
import { User } from '../user/user.entity';
import { ChangePassDto, SignUpDto } from './dtos';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
  async signup(signupDto: SignUpDto) {
    const { username, email, password } = signupDto;
    const user = new User();
    user.username = username;
    user.email = email;

    const roleRepository: RoleRepository = getConnection().getRepository(Role);

    const defaultRole: Role = await roleRepository.findOne({
      where: { name: RoleType.GENERAL },
    });

    user.roles = [defaultRole];

    const details = new UserDetails();

    user.details = details;

    const salt = await genSalt(10);
    user.password = await hash(password, salt);

    await user.save();
  }
}
