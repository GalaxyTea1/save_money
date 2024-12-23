import { Budget } from 'src/budget/entities/budget.entity';
import { Category } from 'src/categories/entities/category.entity';
import { ChatMessage } from 'src/chat/entities/chat-message.entity';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @OneToMany(() => Expense, expense => expense.user, {cascade: true})
  expenses: Expense[];

  @OneToMany(() => Category, category => category.user, {cascade: true})
  categories: Category[];

  @OneToMany(() => ChatMessage, chatMessage => chatMessage.user, {cascade: true})
  chatMessages: ChatMessage[];

  @OneToMany(() => Budget, budget => budget.user)
  budgets: Budget[];
} 