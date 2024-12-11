import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('expense')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  description: string;

  @Column()
  date: Date;

  @Column({ name: 'category_id' })
  categoryId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Category, category => category.expenses)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => User, user => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 