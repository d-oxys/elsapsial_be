import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address of the user',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    example: 'Password123!',
    description: 'Password for the user account',
  })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'driver atau user',
    description:
      'anda harus menambahkan dulu role driver ketika database pertama kali dimuat agar validasi nantinya dapat di lakukan',
  })
  roleName: string;
}

export class RegisterRoleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'driver atau user',
    description: 'tambahkan role driver dan user terlebih dahulu !!!',
  })
  name: string;
}
