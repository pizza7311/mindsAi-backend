import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email']),
) {
  @ApiProperty({ example: 'test4321', required: false })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: 'updated user name', required: false })
  @IsString()
  @IsNotEmpty()
  name?: string;
}
