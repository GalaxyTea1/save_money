import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expense } from 'src/expenses/entities/expense.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  color: string;

  @ManyToOne(() => User, user => user.categories)
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Expense, expense => expense.category)
  expenses: Expense[];
} 