import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
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

  async findAll(userId: string, query?: { startDate?: Date; endDate?: Date; categoryId?: string }): Promise<Expense[]> {
    const where: any = { userId };

    if (query?.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query?.startDate && query?.endDate) {
      where.date = Between(query.startDate, query.endDate);
    }

    return this.expensesRepository.find({
      where,
      order: { date: 'DESC' },
      relations: ['category'],
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

  async findByCategory(userId: string, query?: { startDate?: Date; endDate?: Date; searchValue?: string }): Promise<Expense[]> {
    const where: any = { userId };

    if (query?.startDate && query?.endDate) {
      where.date = Between(query.startDate, query.endDate);
    }

    if (query?.searchValue) {
      where.description = Like(`%${query.searchValue}%`);
    }

    console.log(query)

    return this.expensesRepository.find({ where });
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
} 