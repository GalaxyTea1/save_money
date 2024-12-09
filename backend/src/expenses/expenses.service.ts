import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense> {
    const expense = this.expensesRepository.create({
      ...createExpenseDto,
      userId,
      date: new Date(createExpenseDto.date),
    });
    return this.expensesRepository.save(expense);
  }

  async findAll(userId: string, query?: { startDate?: Date; endDate?: Date; categoryId?: string }) {
    const where: any = { userId };

    if (query?.startDate && query?.endDate) {
      where.date = Between(query.startDate, query.endDate);
    }

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    return this.expensesRepository.find({
      where,
      relations: ['category'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Expense> {
    const expense = await this.expensesRepository.findOne({
      where: { id, userId },
      relations: ['category'],
    });
    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
    return expense;
  }

  async update(id: string, updateExpenseDto: CreateExpenseDto, userId: string): Promise<Expense> {
    const expense = await this.findOne(id, userId);
    Object.assign(expense, {
      ...updateExpenseDto,
      date: new Date(updateExpenseDto.date),
    });
    return this.expensesRepository.save(expense);
  }

  async remove(id: string, userId: string): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expensesRepository.remove(expense);
  }

  async getMonthlyTotal(userId: string, date: Date): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('SUM(expense.amount)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: startOfMonth,
        endDate: endOfMonth,
      })
      .getRawOne();

    return Number(result.total) || 0;
  }
} 