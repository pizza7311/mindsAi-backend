import { ApiProperty } from '@nestjs/swagger';
import { CreateUserResponse } from './create-user.response.dto';

class UserResponseType extends CreateUserResponse {}

export class UserResponse {
  @ApiProperty({
    type: UserResponseType,
  })
  user: UserResponseType;
}

export class UsersResponse {
  @ApiProperty({
    type: [UserResponseType],
  })
  users: UserResponseType[];
}
