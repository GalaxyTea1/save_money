import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('expenses')
@UseGuards(JwtAuthGuard)
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.id);
  }

  @Get()
  findAll(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const query: any = {};
    
    if (startDate && endDate) {
      query.startDate = new Date(startDate);
      query.endDate = new Date(endDate);
    }

    if (categoryId) {
      query.categoryId = categoryId;
    }

    return this.expensesService.findAll(req.user.id, query);
  }

  @Get('monthly-total')
  getMonthlyTotal(@Request() req) {
    return this.expensesService.getMonthlyTotal(req.user.id, new Date());
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.expensesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateExpenseDto: CreateExpenseDto,
    @Request() req,
  ) {
    return this.expensesService.update(id, updateExpenseDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.expensesService.remove(id, req.user.id);
  }
} 