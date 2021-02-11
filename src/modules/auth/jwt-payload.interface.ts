import { RoleType } from '../role/roltype.enum';

export interface IJwtPayload {
  id: number;
  username: string;
  email: string;
  roles: RoleType[];
  iat?: Date;
}
