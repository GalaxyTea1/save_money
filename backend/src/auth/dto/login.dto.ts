import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email',
    example: 'user@example.com',
    type: String
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password',
    example: 'password123',
    minLength: 6,
    type: String
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
} 