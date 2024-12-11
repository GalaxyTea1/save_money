import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ 
    description: 'Category name',
    example: 'Food',
    type: String 
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ 
    description: 'Icon of category',
    example: '🍔',
    type: String 
  })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ 
    description: 'Color of category',
    example: '#FF5733',
    type: String 
  })
  @IsOptional()
  @IsString()
  color?: string;
} 