import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { Budget } from './entities/budget.entity';

@Injectable()
export class BudgetService {
  constructor(
    @InjectRepository(Budget)
    private budgetRepository: Repository<Budget>,
  ) {}

  findAll(): Promise<Budget[]> {
    return this.budgetRepository.find();
  }

  findOne(id: number): Promise<Budget> {
    return this.budgetRepository.findOneBy({ id });
  }

  async create(createBudgetDto: CreateBudgetDto, userId: string): Promise<Budget> {
    const budget = this.budgetRepository.create({
      ...createBudgetDto,
      user_id: userId,
    });
    return this.budgetRepository.save(budget);
  }

  async update(id: number, updateBudgetDto: UpdateBudgetDto, userId: string): Promise<Budget> {
    const budget = await this.budgetRepository.findOneBy({ id, user_id: userId });
    if (!budget) {
      throw new Error('Budget not found');
    }
    Object.assign(budget, updateBudgetDto);
    return this.budgetRepository.save(budget);
  }

  async remove(id: number): Promise<void> {
    await this.budgetRepository.delete(id);
  }
}
