import { Controller, Get, Post, Body, Param, Delete, Put, Request } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { Budget } from './entities/budget.entity';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { CreateBudgetDto } from './dto/create-budget.dto';

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Get()
  findAll(): Promise<Budget[]> {
    return this.budgetService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Budget> {
    return this.budgetService.findOne(+id);
  }

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @Request() req): Promise<Budget> {
    return this.budgetService.create(createBudgetDto, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto, @Request() req) {
    return this.budgetService.update(+id, updateBudgetDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.budgetService.remove(+id);
  }
}
