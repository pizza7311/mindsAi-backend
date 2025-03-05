import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { AuthPayload } from './entities/payload';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    loginDto: LoginDto,
    res: Response,
  ): Promise<{ access_token: string }> {
    try {
      const { email, password } = loginDto;
      const user = await this.userService.findByEmail(email);
      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        throw new UnauthorizedException();
      }

      const payload: AuthPayload = { username: user.name, email: user.email };
      const token = await this.jwtService.signAsync(payload);

      res.cookie('access_token', token, {
        maxAge: 60 * 60 * 8 * 1000,
        httpOnly: true,
      });

      return {
        access_token: token,
      };
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
