import {
  Body,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'prisma/prisma.service';
import { hashPassword } from 'utils/hash';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(@Body() createUserDto: CreateUserDto): Promise<string> {
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
      const users = await this.prisma.user.findMany();
      return users;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
