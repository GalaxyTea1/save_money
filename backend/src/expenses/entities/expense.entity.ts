import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('expense')
export class Expense {
  @ApiProperty({
    description: 'ID of expense',
    example: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Money of expense',
    example: 100000
  })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Description of expense',
    example: 'Money for food',
    nullable: true
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Date of expense',
    example: '2024-03-20T00:00:00.000Z'
  })
  @Column()
  date: Date;

  @ApiProperty({
    description: 'ID of category',
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @Column({ name: 'category_id' })
  categoryId: string;

  @ApiProperty({
    description: 'ID of user',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @Column({ name: 'user_id' })
  userId: string;

  @ApiHideProperty()
  @ManyToOne(() => Category, category => category.expenses)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiHideProperty()
  @ManyToOne(() => User, user => user.expenses)
  @JoinColumn({ name: 'user_id' })
  user: User;
} 