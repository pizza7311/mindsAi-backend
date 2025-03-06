import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'test1234',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
