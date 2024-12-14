import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsernameOrEmail(usernameOrEmail);
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }
    return null;
  }

  generateToken(user: User): string {
    const payload = { userID: user.userID, role: user.role };
    return jwt.sign(payload, 'SECRET_KEY', { expiresIn: '1h' });
  }

  async login(usernameOrEmail: string, password: string): Promise<{ token: string }> {
    const user = await this.validateUser(usernameOrEmail, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user);
    return { token };
  }
}
