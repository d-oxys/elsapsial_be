import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: 'password123',
    description: 'Password for the user account',
  })
  password: string;
}
