import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from '../expenses/entities/expense.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async getMonthlyTotal(userId: string, date: Date): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'total')
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date >= :startDate', { startDate: startOfMonth })
      .andWhere('expense.date <= :endDate', { endDate: endOfMonth })
      .getRawOne();

    return Number(result.total);
  }

  async getMonthlyStats(userId: string, year: number): Promise<any[]> {
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        'EXTRACT(MONTH FROM expense.date) as month',
        'COALESCE(SUM(expense.amount), 0) as total',
        'COUNT(expense.id) as count'
      ])
      .where('expense.userId = :userId', { userId })
      .andWhere('EXTRACT(YEAR FROM expense.date) = :year', { year })
      .groupBy('EXTRACT(MONTH FROM expense.date)')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Chuyển đổi kết quả để có đủ 12 tháng
    const monthlyStats = Array.from({ length: 12 }, (_, index) => {
      const monthData = result.find(item => Number(item.month) === index + 1);
      return {
        month: index + 1,
        total: Number(monthData?.total || 0),
        count: Number(monthData?.count || 0)
      };
    });

    return monthlyStats;
  }

  async getYearlyStats(userId: string): Promise<any[]> {
    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        'EXTRACT(YEAR FROM expense.date) as year',
        'COALESCE(SUM(expense.amount), 0) as total',
        'COUNT(expense.id) as count'
      ])
      .where('expense.userId = :userId', { userId })
      .groupBy('EXTRACT(YEAR FROM expense.date)')
      .orderBy('year', 'DESC')
      .getRawMany();

    return result.map(item => ({
      year: Number(item.year),
      total: Number(item.total),
      count: Number(item.count)
    }));
  }

  async getCategoryStats(userId: string, year: number, month: number) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    const result = await this.expensesRepository
      .createQueryBuilder('expense')
      .leftJoin('expense.category', 'category')
      .select([
        'category.id as "categoryId"',
        'category.name as "categoryName"',
        'category.icon as "categoryIcon"',
        'category.color as "categoryColor"',
        'COALESCE(SUM(expense.amount), 0) as total',
        'COUNT(expense.id) as count'
      ])
      .where('expense.userId = :userId', { userId })
      .andWhere('expense.date >= :startDate', { startDate: startOfMonth })
      .andWhere('expense.date <= :endDate', { endDate: endOfMonth })
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.icon')
      .addGroupBy('category.color')
      .orderBy('total', 'DESC')
      .getRawMany();

    // Tính tổng để tính phần trăm
    const totalAmount = result.reduce((sum, item) => sum + Number(item.total), 0);

    return result.map(item => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      categoryIcon: item.categoryIcon,
      categoryColor: item.categoryColor,
      total: Number(item.total),
      count: Number(item.count),
      percentage: totalAmount > 0 
        ? Number(((Number(item.total) / totalAmount) * 100).toFixed(1))
        : 0
    }));
  }
} 