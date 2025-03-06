import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { AuthPayload } from 'src/auth/entities/payload';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserResponse } from './dto/create-user.response.dto';
import { UserResponse, UsersResponse } from './dto/user.response.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '유저 생성',
  })
  @ApiCreatedResponse({
    description: '생성된 user',
    type: CreateUserResponse,
  })
  @ApiForbiddenResponse({
    description: '이메일 중복시 거부',
    example: 'Email already in use.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '유저 목록',
  })
  @ApiOkResponse({
    description: '유저 목록',
    type: UsersResponse,
  })
  @ApiCookieAuth()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '유저 조회',
  })
  @ApiOkResponse({
    description: '유저',
    type: UserResponse,
  })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '유저 업데이트',
  })
  @ApiForbiddenResponse({
    description: '수정하려는 id가 현재 로그인된 계정이 아닐경우 403',
    example: 'Forbidden request.',
  })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const payload = req['user'] as AuthPayload;
    return this.userService.update(id, updateUserDto, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: '유저 삭제',
  })
  @ApiOkResponse({
    description: '삭제된 유저 ID',
  })
  @ApiForbiddenResponse({
    description: '수정하려는 id가 현재 로그인된 계정이 아닐경우 403',
    example: 'Forbidden request.',
  })
  remove(@Param('id') id: string, @Req() req: Request) {
    const payload = req['user'] as AuthPayload;
    return this.userService.remove(id, payload);
  }
}
