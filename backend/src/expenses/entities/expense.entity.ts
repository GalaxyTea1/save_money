import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: Date;

  @ManyToOne(() => Category, category => category.expenses)
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => User, user => user.expenses)
  user: User;

  @Column()
  userId: string;
} 