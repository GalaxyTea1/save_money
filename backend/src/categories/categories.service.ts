import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    const existingCategory = await this.categoriesRepository.findOne({
      where: { 
        name: createCategoryDto.name,
        userId: userId 
      }
    });

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      userId,
    });
    return this.categoriesRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { userId },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto, userId: string): Promise<Category> {
    const category = await this.findOne(id, userId);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoriesRepository.findOne({
        where: { 
          name: updateCategoryDto.name,
          userId: userId,
          id: Not(id)
        }
      });

      if (existingCategory) {
        throw new ConflictException('Category name already exists');
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.findOne(id, userId);
    
    const hasExpenses = await this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.expenses', 'expense')
      .where('category.id = :id', { id })
      .getOne();

    if (hasExpenses && hasExpenses.expenses.length > 0) {
      throw new ConflictException('Cannot delete category with existing expenses');
    }

    await this.categoriesRepository.remove(category);
  }

  async getCategoryStats(userId: string): Promise<any[]> {
    return this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoin('category.expenses', 'expense')
      .select([
        'category.id',
        'category.name',
        'category.icon',
        'category.color',
        'COUNT(expense.id) as expenseCount',
        'SUM(expense.amount) as totalAmount'
      ])
      .where('category.userId = :userId', { userId })
      .groupBy('category.id')
      .getRawMany();
  }
} 