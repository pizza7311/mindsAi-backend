import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiOkResponse({
    description: 'access_token 쿠키 설정 및 응답.',
  })
  signIn(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInDto, res);
  }

  @Post('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '쿠키에 저장된 access_token 삭제',
  })
  @ApiOkResponse({
    example: 'Singed out.',
  })
  signOut(@Res({ passthrough: true }) res: Response) {
    return this.authService.signOut(res);
  }
}
