import {
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
      const users = await this.prisma.user.findMany();
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

      return user;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    //TODO jwt로 본인 계정만 수정가능하게 예외추가

    try {
      const { password, ...res } = updateUserDto;

      if (password) {
        res['password'] = await hashPassword(password);
      }

      try {
        await this.prisma.user.update({
          where: { id: id },
          data: res,
        });
        //TODO 업데이트 된 필드 리스폰스
        return `This action updates a #${id} user`;
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
