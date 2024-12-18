import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email',
    example: 'user@example.com',
    type: String
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password(min 6 characters)',
    example: 'password123',
    minLength: 6,
    type: String
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Full name',
    example: 'Nguyễn Văn A',
    type: String
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;
} 