import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
  @ApiProperty({
    example: '1948acdd-3649-45e9-9932-2fc5fd3182b7',
  })
  id: string;

  @ApiProperty({
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    example: 'created user',
  })
  name: string;

  @ApiProperty({
    example: Date.now(),
  })
  createdAt: Date;

  @ApiProperty({
    example: Date.now(),
  })
  updatedAt: Date;
}
