import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsEmail,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  readonly tripId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Jakarta',
    description: 'Starting location of the trip',
  })
  readonly startLocation: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Bali',
    description: 'Ending location of the trip',
  })
  readonly endLocation: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({
    example: 2,
    description: 'Number of people included in the trip',
  })
  readonly numberOfPeople: number;
}

export class AcceptOrderDto {
  @IsNotEmpty()
  @IsNumber()
  readonly orderId: number;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly role: string;
}
