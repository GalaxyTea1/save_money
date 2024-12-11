import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Category } from './entities/category.entity';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Category has been created successfully.',
    type: Category 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Category name already exists.' 
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto, @Request() req) {
    return this.categoriesService.create(createCategoryDto, req.user.id);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'List of categories.',
    type: [Category]
  })
  @Get()
  findAll(@Request() req) {
    return this.categoriesService.findAll(req.user.id);
  }

  @ApiOperation({ summary: 'Get one category' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Category information.',
    type: Category
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Category not found.' 
  })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.categoriesService.findOne(id, req.user.id);
  }

  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Category has been updated successfully.',
    type: Category
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Category not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Category name already exists.' 
  })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
    @Request() req,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Category has been deleted.'
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Category not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.CONFLICT, 
    description: 'Category cannot be deleted because it has transactions.' 
  })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.categoriesService.remove(id, req.user.id);
  }

  @ApiOperation({ summary: 'Get transaction report by category' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Transaction report by category.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          icon: { type: 'string' },
          color: { type: 'string' },
          expenseCount: { type: 'number' },
          totalAmount: { type: 'number' }
        }
      }
    }
  })
  @Get('stats/summary')
  getCategoryStats(@Request() req) {
    return this.categoriesService.getCategoryStats(req.user.id);
  }
} 