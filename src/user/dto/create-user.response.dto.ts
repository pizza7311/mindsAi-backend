import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserResponse {
  @ApiProperty({
    example: '1948acdd-3649-45e9-9932-2fc5fd3182b7',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: 'test@test.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: 'created user',
  })
  @Expose()
  name: string;

  @ApiProperty({
    example: Date.now(),
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    example: Date.now(),
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;
}
