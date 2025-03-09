import { ApiProperty } from '@nestjs/swagger';
import { CreateUserResponse } from './create-user.response.dto';
import { Expose, Type } from 'class-transformer';

class UserResponseType extends CreateUserResponse {}

export class UserResponse {
  @ApiProperty({
    type: UserResponseType,
  })
  @Expose()
  user: UserResponseType;
}

export class UsersResponse {
  @ApiProperty({
    type: [UserResponseType],
    isArray: true,
  })
  @Expose()
  @Type(() => UserResponseType)
  users: UserResponseType[];
}
