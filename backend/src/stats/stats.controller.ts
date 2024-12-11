import { Controller, Get, UseGuards, Request, Query, HttpStatus } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Statistics')
@ApiBearerAuth()
@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('monthly-total')
  @ApiOperation({ summary: 'Get monthly total expense' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Monthly total expense.',
    schema: {
      type: 'number',
      example: 1000000
    }
  })
  getMonthlyTotal(@Request() req) {
    return this.statsService.getMonthlyTotal(req.user.id, new Date());
  }

  @Get('monthly-stats')
  @ApiOperation({ summary: 'Get monthly expense statistics' })
  @ApiQuery({ 
    name: 'year', 
    required: false, 
    type: Number,
    description: 'Year to get statistics for (default is current year)'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Monthly expense statistics.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          month: { type: 'number', example: 1 },
          total: { type: 'number', example: 1000000 },
          count: { type: 'number', example: 5 }
        }
      }
    }
  })
  getMonthlyStats(
    @Request() req,
    @Query('year') year?: number
  ) {
    const currentYear = year || new Date().getFullYear();
    return this.statsService.getMonthlyStats(req.user.id, currentYear);
  }

  @Get('yearly-stats')
  @ApiOperation({ summary: 'Get yearly expense statistics' })
  @ApiQuery({ 
    name: 'year', 
    required: false, 
    type: Number,
    description: 'Year to get statistics for (default is current year)'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Yearly expense statistics.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          year: { type: 'number', example: 2024 },
          total: { type: 'number', example: 12000000 },
          count: { type: 'number', example: 60 }
        }
      }
    }
  })
  getYearlyStats(@Request() req) {
    return this.statsService.getYearlyStats(req.user.id);
  }

  @Get('category-stats')
  @ApiOperation({ summary: 'Get information about expenses grouped by category' })
  @ApiQuery({ 
    name: 'year', 
    required: true, 
    type: Number,
    description: 'Year need to get statistics for'
  })
  @ApiQuery({ 
    name: 'month', 
    required: true, 
    type: Number,
    description: 'Month need to get statistics for (1-12)'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Information about expenses grouped by category.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          categoryId: { type: 'string', example: 'uuid' },
          categoryName: { type: 'string', example: 'Food' },
          categoryIcon: { type: 'string', example: '🍔' },
          categoryColor: { type: 'string', example: '#FF5733' },
          total: { type: 'number', example: 500000 },
          count: { type: 'number', example: 10 },
          percentage: { type: 'number', example: 25.5 }
        }
      }
    }
  })
  async getCategoryStats(
    @Request() req,
    @Query('year') year: number,
    @Query('month') month: number
  ) {
    const stats = await this.statsService.getCategoryStats(req.user.id, year, month);
    
    const total = stats.reduce((sum, item) => sum + item.total, 0);
    return stats.map(item => ({
      ...item,
      percentage: total > 0 ? Number(((item.total / total) * 100).toFixed(1)) : 0
    }));
  }
} 