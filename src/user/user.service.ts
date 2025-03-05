import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { hashPassword } from 'utils/hash';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/entities/payload';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    const { email, name, password } = createUserDto;
    const hashedPassword = await hashPassword(password);
    try {
      const res = await this.prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });
      return res.id;
    } catch (e) {
      //uk error
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Email already in use.');
        }
      }
      throw new InternalServerErrorException(e);
    }
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        where: { isActive: true },
      });
      return users;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        //FIXME 아래에 catch throw 겹치는 부분 수정
        throw new NotFoundException('User Not found.');
      }

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: email,
        },
      });

      if (!user) {
        //FIXME 아래에 catch throw 겹치는 부분 수정
        throw new NotFoundException('User Not found.');
      }

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto, reqUser: AuthPayload) {
    try {
      const { password, ...res } = updateUserDto;
      const user = await this.findOne(id);
      if (user.email !== reqUser.email) {
        throw new ForbiddenException('Forbidden request.');
      }

      if (password) {
        res['password'] = await hashPassword(password);
      }

      await this.prisma.user.update({
        where: { id: id },
        data: res,
      });
      //TODO 업데이트 된 필드 리스폰스
      return `This action updates a #${id} user`;
    } catch (e) {
      //not found error
      // if (e instanceof Prisma.PrismaClientKnownRequestError) {
      //   if (e.code === 'P2025') {
      //     throw new NotFoundException('User Not found.');
      //   }
      // }
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: string, reqUser: AuthPayload) {
    try {
      const user = await this.findOne(id);
      if (user.email !== reqUser.email) {
        throw new ForbiddenException('Forbidden request.');
      }
      await this.prisma.user.update({
        where: { id: id },
        data: { isActive: false },
      });
      return `User '${id}' was deleted.`;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
