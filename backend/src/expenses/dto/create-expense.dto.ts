import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ 
    description: 'Money of expense',
    example: 100000,
    minimum: 0
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ 
    description: 'Description of expense',
    example: 'Food'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Date of expense',
    example: '2024-03-20T00:00:00.000Z'
  })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ 
    description: 'ID of category',
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
} 