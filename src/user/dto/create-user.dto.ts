import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'test1234',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'user name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
